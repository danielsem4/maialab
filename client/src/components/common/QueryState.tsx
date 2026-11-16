import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  /** Shown when loaded and empty. */
  isEmpty?: boolean;
  empty?: ReactNode;
  children: ReactNode;
}

/** Standard loading / error / empty handling around a query's content. */
export function QueryState({ isLoading, isError, onRetry, isEmpty, empty, children }: QueryStateProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label={t("common.loading.fetchData")}>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{t("common.loadFailed")}</p>
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            {t("common.retry")}
          </Button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">{empty}</div>;
  }

  return <>{children}</>;
}
