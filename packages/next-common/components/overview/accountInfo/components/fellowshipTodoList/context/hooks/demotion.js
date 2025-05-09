import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import {
  getDemotionPeriod,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";
import useChainOrScanHeight from "next-common/hooks/height";
import { FELLOWSHIP_DEMOTION_WARNING_BLOCKS } from "next-common/utils/consts/fellowship/demotion";
import { useContextMyCoreMember } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/hooks/mine";

export function useDemotionCommonData() {
  const { params: coreParams } = useContextCoreParams();
  const member = useContextMyCoreMember();
  const { rank, status: { lastProof } = {} } = member || {};
  const demotionPeriod = getDemotionPeriod(rank, coreParams);

  return {
    demotionPeriod,
    lastProof,
  };
}

export function useIsDemotionExpired() {
  const { demotionPeriod, lastProof } = useDemotionCommonData();
  const nowHeight = useChainOrScanHeight();
  if (demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  return gone >= demotionPeriod;
}

export function useIsDemotionClosing() {
  const { demotionPeriod, lastProof } = useDemotionCommonData();
  const nowHeight = useChainOrScanHeight();
  if (demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);
  return (
    remainingBlocks < FELLOWSHIP_DEMOTION_WARNING_BLOCKS && remainingBlocks > 0
  );
}
