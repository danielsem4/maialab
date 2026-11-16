import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatFullDate } from "@/common/utils/formatDate";
import { MarkdownView } from "@/components/common/MarkdownView";
import { PublicNotFound } from "@/components/common/PublicNotFound";
import { QueryState } from "@/components/common/QueryState";
import { usePublishedNewsPost } from "@/hooks/queries/useNewsQueries";

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { slug = "" } = useParams();
  const { data: post, isLoading, isError } = usePublishedNewsPost(slug);

  if (isError) return <PublicNotFound backTo="/news" backLabel={t("news.backToNews")} />;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <Link
        to="/news"
        className="inline-flex items-center gap-2 rounded-sm text-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("news.backToNews")}
      </Link>
      <QueryState isLoading={isLoading} isError={false}>
        {post && (
          <>
            <header className="mt-8 max-w-4xl">
              <time dateTime={post.date} className="text-sm text-muted-foreground">
                {formatFullDate(post.date, i18n.language)}
              </time>
              <h1 dir="auto" className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-6xl">
                {post.title}
              </h1>
            </header>
            {post.cover && (
              <img src={post.cover.url} alt={post.cover.alt} className="mt-10 max-h-[32rem] w-full rounded-xl object-cover" />
            )}
            <div className="mt-12 max-w-prose">
              <MarkdownView content={post.body} className="text-lg" />
            </div>
          </>
        )}
      </QueryState>
    </article>
  );
}
