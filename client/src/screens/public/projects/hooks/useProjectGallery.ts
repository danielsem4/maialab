import { useState } from "react";
import { useCarousel } from "@/hooks/common/useCarousel";

/** The gallery carousel plus the full-screen viewer that opens on top of it. */
export function useProjectGallery() {
  const [viewportRef, carousel] = useCarousel();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleOpenViewer = (index: number) => {
    setViewerIndex(index);
  };

  /** Closing the viewer leaves the page carousel on the slide the visitor ended on. */
  const handleCloseViewer = (index: number) => {
    carousel.scrollTo(index, true);
    setViewerIndex(null);
  };

  return { viewportRef, carousel, viewerIndex, handleOpenViewer, handleCloseViewer };
}
