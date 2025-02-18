import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import {
  useContextMyMemberData,
  useContextMyRank,
} from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/myMemberData";
import {
  getDemotionPeriod,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { FELLOWSHIP_DEMOTION_WARNING_BLOCKS } from "next-common/utils/consts/fellowship/demotion";

export function useDemotionCommonData() {
  const { params: coreParams } = useContextCoreParams();
  const rank = useContextMyRank();
  const demotionPeriod = getDemotionPeriod(rank, coreParams);
  const { memberData } = useContextMyMemberData();

  const {
    memberData: {
      coreMember: { lastProof },
    },
  } = useContextMyMemberData();

  return {
    demotionPeriod,
    memberData,
    lastProof,
  };
}

export function useIsDemotionExpired() {
  const { demotionPeriod, lastProof } = useDemotionCommonData();
  const nowHeight = useSelector(chainOrScanHeightSelector);
  if (demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  return gone >= demotionPeriod;
}

export function useIsDemotionClosing() {
  const { demotionPeriod, lastProof } = useDemotionCommonData();
  const nowHeight = useSelector(chainOrScanHeightSelector);
  if (demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);
  return (
    remainingBlocks < FELLOWSHIP_DEMOTION_WARNING_BLOCKS && remainingBlocks > 0
  );
}
