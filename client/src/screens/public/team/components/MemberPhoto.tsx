import type { IMember } from "@/common/types/Member";
import { getInitials } from "@/common/utils/getInitials";
import { cn } from "@/lib/utils";

interface MemberPhotoProps {
  member: IMember;
  className?: string;
  initialsClassName?: string;
}

/** Member portrait, or a tinted initials block when there is no photo. */
export function MemberPhoto({ member, className, initialsClassName }: MemberPhotoProps) {
  if (member.photo) {
    return (
      <img
        src={member.photo.url}
        alt={member.photo.alt || member.name}
        loading="lazy"
        className={cn("w-full rounded-lg bg-muted object-cover", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn("flex w-full items-center justify-center rounded-lg bg-accent text-accent-foreground", className)}
    >
      <span className={cn("font-display text-4xl font-semibold tracking-tight opacity-70", initialsClassName)}>
        {getInitials(member.name)}
      </span>
    </div>
  );
}
