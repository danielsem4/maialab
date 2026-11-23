import { useTranslation } from "react-i18next";
import type { ITeamGroup } from "../hooks/useTeamPage";
import { MemberPortrait } from "./MemberPortrait";
import { PrincipalInvestigator } from "./PrincipalInvestigator";

interface TeamSectionProps {
  group: ITeamGroup;
}

function SectionBody({ group }: TeamSectionProps) {
  if (group.category === "PI") {
    return (
      <div className="space-y-16">
        {group.members.map((member) => (
          <PrincipalInvestigator key={member.id} member={member} />
        ))}
      </div>
    );
  }

  if (group.category === "ALUMNI") {
    return (
      <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {group.members.map((member) => (
          <li key={member.id} className="border-b pb-3" dir="auto">
            <span className="font-medium">{member.name}</span>
            {member.title && <span className="block text-sm text-muted-foreground">{member.title}</span>}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
      {group.members.map((member) => (
        <MemberPortrait key={member.id} member={member} />
      ))}
    </ul>
  );
}

export function TeamSection({ group }: TeamSectionProps) {
  const { t } = useTranslation();
  const headingId = `team-${group.category.toLowerCase()}`;

  return (
    <section aria-labelledby={headingId} className="border-t pt-8">
      <h2 id={headingId} className="mb-6 font-display text-2xl sm:mb-10 font-semibold tracking-tight sm:text-3xl">
        {t(`members.category.${group.category}`)}
      </h2>
      <SectionBody group={group} />
    </section>
  );
}
