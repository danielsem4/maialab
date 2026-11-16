import type { IMember } from "@/common/types/Member";
import { MemberLinks } from "./MemberLinks";
import { MemberPhoto } from "./MemberPhoto";

interface MemberPortraitProps {
  member: IMember;
}

export function MemberPortrait({ member }: MemberPortraitProps) {
  return (
    <li className="min-w-0">
      <MemberPhoto member={member} className="aspect-[4/5]" />
      <h3 className="mt-4 font-display text-lg leading-snug font-semibold" dir="auto">
        {member.name}
      </h3>
      {member.title && (
        <p className="mt-0.5 text-sm text-muted-foreground" dir="auto">
          {member.title}
        </p>
      )}
      <div className="mt-2">
        <MemberLinks member={member} />
      </div>
    </li>
  );
}
