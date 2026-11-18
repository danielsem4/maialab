import type { CSSProperties } from "react";
import type { ITextProps } from "@/common/types/Deck";
import { fontStack } from "@/lib/deck/slideStyles";

const JUSTIFY: Record<ITextProps["verticalAlign"], CSSProperties["justifyContent"]> = {
  top: "flex-start",
  middle: "center",
  bottom: "flex-end",
};

const DEFAULT_FONT_SIZE = 40;

/** Box styles for deck text, used by the static renderer and the in-place editor alike. */
export function textContainerStyle(props: ITextProps): CSSProperties {
  return {
    display: "flex",
    flexDirection: "column",
    justifyContent: JUSTIFY[props.verticalAlign] ?? "flex-start",
    width: "100%",
    height: "100%",
    fontSize: Number.isFinite(props.fontSize) && props.fontSize > 0 ? props.fontSize : DEFAULT_FONT_SIZE,
    color: "var(--deck-text)",
    fontFamily: fontStack("body"),
  };
}

export function textDir(props: ITextProps): ITextProps["dir"] {
  return props.dir === "ltr" || props.dir === "rtl" ? props.dir : "auto";
}
