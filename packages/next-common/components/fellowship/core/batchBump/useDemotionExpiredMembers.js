import { useMemo } from "react";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { partition } from "lodash-es";
import useChainOrScanHeight from "next-common/hooks/height";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import useObjectMemo from "next-common/hooks/useObjectMemo";

export function useFilterExpiredMembers({
  members,
  isMembersLoading,
  params,
  isParamsLoading,
}) {
  const latestHeight = useChainOrScanHeight();

  const expiredMembers = useMemo(() => {
    if (isMembersLoading || isParamsLoading) {
      return [];
    }

    return (members || []).filter((coreMember) => {
      const {
        status: { lastProof },
        rank,
      } = coreMember;

      return isDemotionExpired({ lastProof, rank, params, latestHeight });
    });
  }, [members, params, isMembersLoading, isParamsLoading, latestHeight]);

  return useObjectMemo(expiredMembers);
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

  const expiredMembers = useFilterExpiredMembers({
    members,
    isMembersLoading,
    params,
    isParamsLoading,
  });

  return {
    expiredMembers,
    isLoading: isMembersLoading || isParamsLoading,
  };
}
