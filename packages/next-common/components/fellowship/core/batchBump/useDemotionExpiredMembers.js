import { useMemo, useRef } from "react";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { partition } from "lodash-es";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useCoreFellowshipParams } from "next-common/context/collectives/collectives";
import { isDemotionExpired } from "next-common/utils/collective/demotionAndPromotion";
import { isEqual } from "lodash-es";

export default function useDemotionExpiredMembers() {
  const { members: coreMembers, isLoading } = useFellowshipCoreMembers();

  const [members] = useMemo(
    () => partition(coreMembers, (m) => m.rank > 0),
    [coreMembers],
  );

  const latestHeight = useSelector(chainOrScanHeightSelector);
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
