import { useSelector } from "react-redux";
import {
  getDemotionExpiredCount,
  useEligibleFellowshipCoreMembers,
} from "next-common/components/fellowship/core/memberWarnings";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";

export default function useDemotionExpirationCount() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { params } = useContextCoreParams();
  const { members, loading: isLoading } = useEligibleFellowshipCoreMembers();

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
