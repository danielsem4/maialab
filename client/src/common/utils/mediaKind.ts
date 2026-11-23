export type MediaKind = "image" | "video" | "file";

/** Broad kind of an uploaded file, from its MIME type. */
export function getMediaKind(mimeType: string): MediaKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  return "file";
}

/** URL that makes a <video> show its first frame as a still, before the visitor presses play. */
export function videoPosterUrl(url: string): string {
  return url.includes("#") ? url : `${url}#t=0.1`;
}
