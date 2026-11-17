import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { INewsPost } from "@/common/types/NewsPost";
import { excerpt } from "@/common/utils/excerpt";
import { formatFullDate } from "@/common/utils/formatDate";

interface NewsListItemProps {
  post: INewsPost;
}

export function NewsListItem({ post }: NewsListItemProps) {
  const { i18n } = useTranslation();
  const summary = excerpt(post.body);

  return (
    <li className="border-b">
      <Link
        to={`/news/${post.slug}`}
        className="group grid gap-x-10 gap-y-4 py-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:grid-cols-[1fr_16rem]"
      >
        <div className="min-w-0">
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatFullDate(post.date, i18n.language)}
          </time>
          <h2
            dir="auto"
            className="mt-2 font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary sm:text-3xl"
          >
            {post.title}
          </h2>
          {summary && (
            <p dir="auto" className="mt-4 max-w-2xl text-lg text-muted-foreground">
              {summary}
            </p>
          )}
        </div>
        {post.cover && (
          <img
            src={post.cover.url}
            alt={post.cover.alt}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        )}
      </Link>
    </li>
  );
}
