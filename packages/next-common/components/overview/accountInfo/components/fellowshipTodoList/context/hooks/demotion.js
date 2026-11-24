import { isNil } from "lodash-es";
import { useContextCoreParams } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/context/coreParams";
import {
  getDemotionPeriod,
  getRemainingBlocks,
} from "next-common/utils/collective/demotionAndPromotion";
import useCoreFellowshipLatestHeight from "next-common/hooks/fellowship/core/useCoreFellowshipLatestHeight";
import useCoreFellowshipBlockTime from "next-common/hooks/fellowship/core/useCoreFellowshipBlockTime";
import { FELLOWSHIP_DEMOTION_WARNING_TIME } from "next-common/utils/consts/fellowship/demotion";
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
  const nowHeight = useCoreFellowshipLatestHeight();
  if (isNil(nowHeight) || demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  return gone >= demotionPeriod;
}

export function useIsDemotionClosing() {
  const { demotionPeriod, lastProof } = useDemotionCommonData();
  const nowHeight = useCoreFellowshipLatestHeight();
  const blockTime = useCoreFellowshipBlockTime();
  if (isNil(nowHeight) || demotionPeriod <= 0) {
    return false;
  }

  const gone = nowHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);
  const warningBlocks = FELLOWSHIP_DEMOTION_WARNING_TIME / blockTime;
  return remainingBlocks < warningBlocks && remainingBlocks > 0;
}
