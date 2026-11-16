import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { DeckFile, PresentationService } from './presentations.service';
import type { LabDeckDto } from './presentations.schema';

const PPTX_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

/** ASCII-only fallback for clients that ignore `filename*`. */
function asciiFilename(name: string): string {
  const safe = name
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/["\\/:*?<>|]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return safe || 'presentation';
}

function sendDeck(res: Response, deck: DeckFile): void {
  const disposition =
    `attachment; filename="${asciiFilename(deck.name)}.pptx"; ` +
    `filename*=UTF-8''${encodeURIComponent(deck.name)}.pptx`;
  res.setHeader('Content-Type', PPTX_MIME);
  res.setHeader('Content-Disposition', disposition);
  res.setHeader('Content-Length', deck.buffer.length);
  res.end(deck.buffer);
}

export function createPresentationController(service: PresentationService) {
  return {
    async projectDeck(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const deck = await service.exportProjectDeck(req.currentUser!.userId, parseId(req.params['id']));
        sendDeck(res, deck);
      } catch (err) {
        next(err);
      }
    },

    async labDeck(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const deck = await service.exportLabDeck(req.currentUser!.userId, req.body as LabDeckDto);
        sendDeck(res, deck);
      } catch (err) {
        next(err);
      }
    },
  };
}
