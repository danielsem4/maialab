import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

const COMPONENT_CLASSES = {
  h1: "font-display text-2xl font-semibold mt-8 mb-3 sm:text-3xl",
  h2: "font-display text-xl font-semibold mt-8 mb-3 sm:text-2xl",
  h3: "font-display text-lg font-semibold mt-6 mb-2 sm:text-xl",
  p: "my-4 leading-relaxed",
  ul: "my-4 ps-6 list-disc space-y-1",
  ol: "my-4 ps-6 list-decimal space-y-1",
  a: "text-primary underline underline-offset-4 hover:text-primary/80",
  blockquote: "my-6 border-s-4 border-primary/40 ps-4 text-muted-foreground",
  code: "rounded bg-muted px-1.5 py-0.5 text-[0.9em]",
  pre: "my-4 overflow-x-auto rounded-lg bg-muted p-3 text-sm [&>code]:bg-transparent [&>code]:p-0",
  img: "my-6 rounded-lg",
} as const;

const components = Object.fromEntries(
  Object.entries(COMPONENT_CLASSES).map(([tag, className]) => [
    tag,
    (props: Record<string, unknown>) => {
      const rest = { ...props };
      delete rest.node;
      const Tag = tag as "p";
      return <Tag className={className} {...rest} />;
    },
  ]),
);

/** Renders admin-authored Markdown. Raw HTML is not rendered (react-markdown default). */
export function MarkdownView({ content, className }: MarkdownViewProps) {
  return (
    <div className={cn("text-base break-words text-foreground/90", className)}>
      <Markdown components={components}>{content}</Markdown>
    </div>
  );
}
