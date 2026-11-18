import { ImageOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IImageProps } from "@/common/types/Deck";
import type { IElementRenderProps } from "../types";
import { useImageStatus } from "./useImageStatus";

export function ImageRender({ element }: IElementRenderProps<IImageProps>) {
  const { t } = useTranslation();
  const { url, alt, fit, radius } = element.props;
  const { isMissing, handleError } = useImageStatus(url);

  if (isMissing) {
    // The file was deleted from the media library (or never loaded): keep the box, explain why it is empty.
    return (
      <div
        role="img"
        aria-label={alt || t("decks.editor.imageMissing")}
        className="flex size-full flex-col items-center justify-center gap-3 overflow-hidden bg-slate-200 p-4 text-center text-2xl text-slate-500"
        style={{ borderRadius: radius }}
      >
        <ImageOff className="size-16 shrink-0" aria-hidden="true" />
        <span dir="auto">{alt || t("decks.editor.imageMissing")}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      draggable={false}
      onError={handleError}
      style={{ display: "block", width: "100%", height: "100%", objectFit: fit, borderRadius: radius }}
    />
  );
}
