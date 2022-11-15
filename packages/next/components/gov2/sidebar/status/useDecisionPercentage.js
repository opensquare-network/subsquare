import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "next-common/store/reducers/chainSlice";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useDecision } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";

export default function useDecisionPercentage() {
  const latestHeight = useSelector(latestHeightSelector);
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecision();
  if (isNil(latestHeight) || latestHeight <= decidingSince) {
    return 0;
  }

  const finishHeight = decidingSince + decisionPeriod;
  if (latestHeight >= finishHeight) {
    return 100;
  }

  const gone = latestHeight - decidingSince;
  return (gone / decisionPeriod) * 100;
}

// get decision remaining time in ms
export function useDecisionRemaining() {
  const latestHeight = useSelector(latestHeightSelector);
  const decidingSince = useDecidingSince();
  const decisionPeriod = useDecision();
  const blockTime = useSelector(blockTimeSelector);
  if (isNil(latestHeight)) {
    return 0;
  }

  const gone = latestHeight - decidingSince;
  if (gone > decisionPeriod) {
    return 0;
  } else {
    return (decisionPeriod - gone) * blockTime;
  }
}
