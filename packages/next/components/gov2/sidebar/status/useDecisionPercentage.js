import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
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
