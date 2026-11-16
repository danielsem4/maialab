import { useSearchParams } from "react-router-dom";
import type { IPublication } from "@/common/types/Publication";
import { usePublishedPublications } from "@/hooks/queries/usePublicationQueries";

export interface IYearGroup {
  year: number;
  publications: IPublication[];
}

/** Published publications grouped by year (newest first), with a ?year= filter kept in the URL. */
export function usePublicationsPage() {
  const query = usePublishedPublications();
  const [searchParams, setSearchParams] = useSearchParams();
  const all = query.data ?? [];

  const years = [...new Set(all.map((p) => p.year))].sort((a, b) => b - a);
  const requested = Number(searchParams.get("year"));
  const year = years.includes(requested) ? requested : null;

  const groups: IYearGroup[] = (year ? [year] : years).map((y) => ({
    year: y,
    publications: all.filter((p) => p.year === y),
  }));

  const handleYearChange = (next: number | null) => {
    setSearchParams(next ? { year: String(next) } : {}, { replace: true });
  };

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    groups,
    years,
    year,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: all.length === 0,
    handleYearChange,
    handleRetry,
  };
}
