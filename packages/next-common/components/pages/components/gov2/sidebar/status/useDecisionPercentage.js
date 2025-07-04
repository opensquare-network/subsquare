import {
  useConfirming,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import { useDecision } from "next-common/context/post/gov2/track";
import { isNil } from "lodash-es";
import { useOnchainData, usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import useChainOrScanHeight from "next-common/hooks/height";
import { useMemo } from "react";

export function useDecisionEnd() {
  const trackDecision = useDecision();
  const decidingSince = useDecidingSince();
  const confirming = useConfirming();
  const state = usePostState();
  const onchain = useOnchainData();

  return useMemo(() => {
    const normalCase = decidingSince + trackDecision;
    if (onchain?.rejected) {
      return Math.max(normalCase, onchain.rejected[0]);
    } else if (onchain?.approved) {
      return Math.max(normalCase, onchain.approved[0]);
    } else if (gov2State.Confirming === state) {
      // note: referendum can still be deciding even after decision period gone, when it's still confirming.
      return Math.max(normalCase, confirming || 0);
    } else {
      return normalCase;
    }
  }, [onchain, state, decidingSince, trackDecision, confirming]);
}

export function useDecisionBlocks() {
  const period = useDecision();
  const end = useDecisionEnd();
  const decidingSince = useDecidingSince();
  if (!decidingSince) {
    return period;
  }

  return end - decidingSince;
}

// get decision remaining blocks
export function useDecisionRemaining() {
  const latestHeight = useChainOrScanHeight();
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecisionBlocks();
  if (isNil(latestHeight)) {
    return 0;
  }

  const gone = latestHeight - decidingSince;
  if (gone > decisionPeriod) {
    return 0;
  } else {
    return decisionPeriod - gone;
  }
}
