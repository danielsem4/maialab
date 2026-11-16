import { MEMBER_CATEGORIES, type IMember, type MemberCategory } from "@/common/types/Member";
import { usePublishedMembers } from "@/hooks/queries/useMemberQueries";

export interface ITeamGroup {
  category: MemberCategory;
  members: IMember[];
}

/** Published members grouped by category, in MEMBER_CATEGORIES order, empty groups skipped. */
export function useTeamPage() {
  const query = usePublishedMembers();
  const all = query.data ?? [];
  const groups: ITeamGroup[] = MEMBER_CATEGORIES.map((category) => ({
    category,
    members: all.filter((m) => m.category === category),
  })).filter((group) => group.members.length > 0);

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    groups,
    isLoading: query.isLoading,
    isError: query.isError,
    isEmpty: all.length === 0,
    handleRetry,
  };
}
