import { useTranslation } from "react-i18next";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { usePublishedNews } from "@/hooks/queries/useNewsQueries";
import { NewsListItem } from "./components/NewsListItem";

export default function NewsPage() {
  const { t } = useTranslation();
  const { data: posts = [], isLoading, isError, refetch } = usePublishedNews();

  const handleRetry = () => {
    void refetch();
  };

  return (
    <>
      <PublicPageHeader title={t("news.publicTitle")} />
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          onRetry={handleRetry}
          isEmpty={posts.length === 0}
          empty={t("news.publicEmpty")}
        >
          <ul className="border-t">
            {posts.map((post) => (
              <NewsListItem key={post.id} post={post} />
            ))}
          </ul>
        </QueryState>
      </section>
    </>
  );
}
