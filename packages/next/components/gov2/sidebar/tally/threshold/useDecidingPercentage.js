import { useDecision } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export function useDecidingEndPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  const endHeight = votingFinishHeight || latestHeight;

  return useMemo(() => {
    if (isNil(endHeight)) {
      return null;
    }

    if (isNil(decidingSince)) {
      return 0;
    }

    const gone = endHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, endHeight]);
}

export default function useDecidingPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const latestHeight = useSelector(latestHeightSelector);

  return useMemo(() => {
    if (isNil(decidingSince) || isNil(latestHeight)) {
      return null;
    }

    const gone = latestHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, latestHeight]);
}
