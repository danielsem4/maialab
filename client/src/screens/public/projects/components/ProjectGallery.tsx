import type { IProjectImage } from "@/common/types/Project";

interface ProjectGalleryProps {
  images: IProjectImage[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {images.map((image) => (
        <figure key={image.mediaId} className="space-y-2">
          <img
            src={image.media.url}
            alt={image.media.alt || image.caption}
            loading="lazy"
            className="w-full rounded-lg object-cover"
          />
          {image.caption && <figcaption className="text-sm text-muted-foreground">{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
