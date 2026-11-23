import type { IMember } from "@/common/types/Member";
import { LINK_CLASS } from "../linkClass";

interface ContactTeamListProps {
  members: IMember[];
}

/** Name, title and email for each team member on the contact page. */
export function ContactTeamList({ members }: ContactTeamListProps) {
  return (
    <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
      {members.map((member) => (
        <li key={member.id} className="min-w-0">
          <p dir="auto" className="font-medium">
            {member.name}
          </p>
          {member.title && (
            <p dir="auto" className="text-sm text-muted-foreground">
              {member.title}
            </p>
          )}
          <a href={`mailto:${member.email}`} dir="ltr" className={`inline-flex min-h-10 items-center text-sm break-all text-primary sm:mt-1 sm:min-h-0 ${LINK_CLASS}`}>
            {member.email}
          </a>
        </li>
      ))}
    </ul>
  );
}
