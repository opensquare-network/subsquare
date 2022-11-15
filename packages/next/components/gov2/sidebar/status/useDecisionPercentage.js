import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import {
  useConfirming,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import { useDecision } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";

export function useDecisionEnd() {
  const trackDecision = useDecision();
  const decidingSince = useDecidingSince();
  const confirming = useConfirming();

  return Math.max(decidingSince + trackDecision, confirming || 0);
}

export function useDecisionBlocks() {
  const end = useDecisionEnd();
  const decidingSince = useDecidingSince();
  return end - decidingSince;
}

// get decision remaining blocks
export function useDecisionRemaining() {
  const latestHeight = useSelector(latestHeightSelector);
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
