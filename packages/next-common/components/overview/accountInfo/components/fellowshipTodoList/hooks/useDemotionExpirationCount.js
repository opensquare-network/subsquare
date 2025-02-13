import { useSelector } from "react-redux";
import {
  getDemotionExpiredCount,
  useEligibleFellowshipCoreMembers,
} from "next-common/components/fellowship/core/memberWarnings";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import useCoreFellowshipParams from "next-common/hooks/fellowship/core/useCoreFellowshipParams";

export default function useDemotionExpirationCount() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { params, isLoading: isParamsLoading } = useCoreFellowshipParams();
  const { members, loading: isLoading } = useEligibleFellowshipCoreMembers();

  if (isParamsLoading) {
    return { isLoading: true };
  }

  const expiredMembersCount = getDemotionExpiredCount({
    members,
    latestHeight,
    params,
  });

  return {
    expiredMembersCount,
    isLoading,
  };
}
