import { useMemo } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import useObjectMemo from "next-common/hooks/useObjectMemo";

export function useFilterExpiredMembers({
  members,
  isMembersLoading,
  params,
  isParamsLoading,
}) {
  const latestHeight = useSelector(chainOrScanHeightSelector);

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
    useFellowshipCoreMembers();

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
