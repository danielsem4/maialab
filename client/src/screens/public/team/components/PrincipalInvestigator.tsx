import type { IMember } from "@/common/types/Member";
import { MarkdownView } from "@/components/common/MarkdownView";
import { MemberLinks } from "./MemberLinks";
import { MemberPhoto } from "./MemberPhoto";

interface PrincipalInvestigatorProps {
  member: IMember;
}

/** Large feature treatment for a principal investigator. */
export function PrincipalInvestigator({ member }: PrincipalInvestigatorProps) {
  return (
    <article className="grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-12">
      <MemberPhoto member={member} className="aspect-[4/5] max-w-xs md:max-w-none" initialsClassName="text-7xl" />
      <div className="min-w-0">
        <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl" dir="auto">
          {member.name}
        </h3>
        {member.title && (
          <p className="mt-2 text-lg text-primary" dir="auto">
            {member.title}
          </p>
        )}
        <div className="mt-4">
          <MemberLinks member={member} />
        </div>
        {member.bio && <MarkdownView content={member.bio} className="mt-4 max-w-2xl" />}
      </div>
    </article>
  );
}
