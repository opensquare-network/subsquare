import { useDecision } from "./track";
import { useDecidingSince } from "./referendum";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export function useDecidingEndHeight() {
  const latestHeight = useAhmLatestHeight();
  const votingFinishHeight = useReferendumVotingFinishHeight();
  return votingFinishHeight || latestHeight;
}

export function useDecidingEndPercentage() {
  const decisionPeriod = useDecision();
  const decidingSince = useDecidingSince();
  const endHeight = useDecidingEndHeight();
  const votingFinishHeight = useReferendumVotingFinishHeight();

  return useMemo(() => {
    if (isNil(endHeight)) {
      return null;
    } else if (votingFinishHeight) {
      return 1;
    }

    if (isNil(decidingSince)) {
      return 0;
    }

    const gone = endHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, endHeight, votingFinishHeight]);
}
