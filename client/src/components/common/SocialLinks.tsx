import { Github, Globe, Linkedin, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ISocialLinks } from "@/common/types/LabInfo";
import { safeHref } from "@/common/utils/safeHref";

const ICONS = { website: Globe, github: Github, linkedin: Linkedin, twitter: Twitter, youtube: Youtube } as const;

interface SocialLinksProps {
  links: ISocialLinks;
}

export function SocialLinks({ links }: SocialLinksProps) {
  const { t } = useTranslation();
  const entries = (Object.keys(ICONS) as (keyof typeof ICONS)[]).filter((key) => safeHref(links[key]));

  if (entries.length === 0) return null;

  return (
    <ul className="flex items-center gap-1">
      {entries.map((key) => {
        const Icon = ICONS[key];
        return (
          <li key={key}>
            <a
              href={safeHref(links[key])}
              target="_blank"
              rel="noreferrer"
              aria-label={t(`labInfo.fields.${key}`)}
              className="inline-flex size-11 items-center sm:size-9 justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
