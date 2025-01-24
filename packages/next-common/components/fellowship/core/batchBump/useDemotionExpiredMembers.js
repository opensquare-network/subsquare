import { useMemo, useRef } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useFellowshipCoreMember";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import { isEqual } from "lodash-es";

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

  const latestHeight = useSelector(chainOrScanHeightSelector);

  const { params, isLoading: isParamsLoading } = useCoreFellowshipParams();
  const expiredMembersRef = useRef([]);

  const expiredMembers = useMemo(() => {
    const newExpiredMembers = (members || []).filter((coreMember) => {
      if (isParamsLoading) {
        return false;
      }

      const {
        status: { lastProof },
        rank,
      } = coreMember;

      return isDemotionExpired({ lastProof, rank, params, latestHeight });
    });

    if (!isEqual(newExpiredMembers, expiredMembersRef.current)) {
      expiredMembersRef.current = newExpiredMembers;
    }

    return expiredMembersRef.current;
  }, [members, latestHeight, params, isParamsLoading]);

  return {
    expiredMembers,
    isLoading: isMembersLoading || isParamsLoading,
  };
}
