import { useDecision } from "./track";
import { useDecidingSince } from "./referendum";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import { useMemo } from "react";
import isNil from "lodash.isnil";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export function useDecidingEndHeight() {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const votingFinishHeight = useReferendumVotingFinishHeight();
  return votingFinishHeight || latestHeight;
}

export function useDecidingEndPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const endHeight = useDecidingEndHeight();

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
