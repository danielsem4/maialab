import { useState } from "react";

/** Tracks whether the image at `url` failed to load. A new url starts fresh without an effect. */
export function useImageStatus(url: string) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const handleError = () => {
    setFailedUrl(url);
  };

  return { isMissing: !url || failedUrl === url, handleError };
}
