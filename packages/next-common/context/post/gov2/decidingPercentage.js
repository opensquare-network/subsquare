import { useDecision } from "./track";
import { useDecidingSince } from "./referendum";
import { useMemo } from "react";
import { isNil } from "lodash-es";
import useReferendumVotingFinishHeight from "../referenda/useReferendumVotingFinishHeight";
import useChainOrScanHeight from "next-common/hooks/height";

export function useDecidingEndHeight() {
  const latestHeight = useChainOrScanHeight();
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
  const latestHeight = useChainOrScanHeight();

  return useMemo(() => {
    if (isNil(decidingSince) || isNil(latestHeight)) {
      return null;
    }

    const gone = latestHeight - decidingSince;
    return Math.min(gone / decisionPeriod, 1);
  }, [decisionPeriod, decidingSince, latestHeight]);
}
