import { useMemo, useRef } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import { isEqual } from "lodash-es";

export default function useDemotionExpiredMembers({
  isCandidate = false,
  blockHeight,
} = {}) {
  const { members: coreMembers, loading: isLoading } =
    useFellowshipCoreMembers();

  const [members] = useMemo(
    () =>
      partition(coreMembers, (m) => (isCandidate ? m.rank <= 0 : m.rank > 0)),
    [coreMembers, isCandidate],
  );

  const defaultLatestHeight = useSelector(chainOrScanHeightSelector);
  const latestHeight = blockHeight || defaultLatestHeight;

  const params = useCoreFellowshipParams();
  const expiredMembersRef = useRef([]);

  const expiredMembers = useMemo(() => {
    const newExpiredMembers = (members || []).filter((coreMember) => {
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
  }, [members, latestHeight, params]);

  return {
    expiredMembers,
    isLoading,
  };
}
