import { useParams } from "react-router-dom";
import type { IDeck } from "@/common/types/Deck";
import { getApiErrorStatus } from "@/common/utils/apiError";
import { useDeck } from "@/hooks/queries/useDeckQueries";
import { parseDeckDoc } from "@/lib/deck/deckDoc";

export type DeckLoadStatus = "loading" | "notFound" | "invalid" | "error" | "ready";

interface IDeckLoad {
  status: DeckLoadStatus;
  deck: IDeck | null;
}

/** Loads the deck named in the route and checks that the editor can open its document. */
export function useDeckLoader(): IDeckLoad {
  const params = useParams();
  const id = Number(params.id);
  const isValidId = Number.isInteger(id) && id > 0;
  const query = useDeck(isValidId ? id : 0);

  if (!isValidId) return { status: "notFound", deck: null };
  if (query.isError) {
    return { status: getApiErrorStatus(query.error) === 404 ? "notFound" : "error", deck: null };
  }
  if (!query.data) return { status: "loading", deck: null };

  const doc = parseDeckDoc(query.data.doc);
  if (!doc) return { status: "invalid", deck: null };
  return { status: "ready", deck: query.data };
}
