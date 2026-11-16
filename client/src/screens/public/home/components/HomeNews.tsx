import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { INewsPost } from "@/common/types/NewsPost";
import { firstLine } from "@/common/utils/excerpt";
import { formatFullDate } from "@/common/utils/formatDate";
import { HomeSectionHeading } from "./HomeSectionHeading";

interface HomeNewsProps {
  posts: INewsPost[];
}

export function HomeNews({ posts }: HomeNewsProps) {
  const { t, i18n } = useTranslation();

  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="home-news" className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-6">
      <HomeSectionHeading id="home-news" title={t("site.latestNews")} linkTo="/news" linkLabel={t("site.allNews")} />
      <ul className="border-t">
        {posts.map((post) => (
          <li key={post.id} className="border-b">
            <Link
              to={`/news/${post.slug}`}
              className="group grid gap-x-8 gap-y-1 py-6 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:grid-cols-[11rem_1fr]"
            >
              <time dateTime={post.date} className="text-sm text-muted-foreground md:pt-1.5">
                {formatFullDate(post.date, i18n.language)}
              </time>
              <div className="min-w-0">
                <h3 dir="auto" className="font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                {post.body && (
                  <p dir="auto" className="mt-1 truncate text-muted-foreground">
                    {firstLine(post.body)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
