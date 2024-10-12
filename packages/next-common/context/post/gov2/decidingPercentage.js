import { useDecision } from "./track";
import { useDecidingSince } from "./referendum";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export function useDecidingEndHeight() {
  const latestHeight = useBlockHeight();
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
  const latestHeight = useBlockHeight();

  return useMemo(() => {
    if (isNil(decidingSince) || isNil(latestHeight)) {
      return null;
    }

    const gone = latestHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, latestHeight]);
}
