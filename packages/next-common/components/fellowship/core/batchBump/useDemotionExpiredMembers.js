import { useMemo } from "react";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { isNil, partition } from "lodash-es";
import useCoreFellowshipLatestHeight from "next-common/hooks/fellowship/core/useCoreFellowshipLatestHeight";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import useObjectMemo from "next-common/hooks/useObjectMemo";

export function useFilterExpiredMembers({
  members,
  isMembersLoading,
  params,
  isParamsLoading,
}) {
  const latestHeight = useCoreFellowshipLatestHeight();
  const isLoading = isMembersLoading || isParamsLoading || isNil(latestHeight);

  const expiredMembers = useMemo(() => {
    if (isLoading) {
      return [];
    }

    return (members || []).filter((coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      return isDemotionExpired({ lastProof, rank, params, latestHeight });
    });
  }, [members, params, isLoading, latestHeight]);

  return { expiredMembers: useObjectMemo(expiredMembers), isLoading };
}

export default function useDemotionExpiredMembers({
  isCandidate = false,
} = {}) {
  const { members: coreMembers, loading: isMembersLoading } =
    useFellowshipCoreMembersWithRank();

  const [members] = useMemo(
    () =>
      partition(coreMembers, (m) => (isCandidate ? m.rank <= 0 : m.rank > 0)),
    [coreMembers, isCandidate],
  );

  const { params, isLoading: isParamsLoading } = useCoreFellowshipParams();

  return useFilterExpiredMembers({
    members,
    isMembersLoading,
    params,
    isParamsLoading,
  });
}
