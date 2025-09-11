import { useOnchainData, useTimelineData } from "../index";
import { gov2State, gov2VotingStates } from "../../../utils/consts/state";
import { useMemo } from "react";

export function useReferendumVotingFinishIndexer() {
  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.TimedOut,
      gov2State.Cancelled,
      gov2State.Killed,
      "Confirmed",
    ].includes(item.name),
  );

  return finishItem?.indexer;
}

export function useIsReferendumFinalState() {
  const timeline = useTimelineData();
  return (timeline || []).find((item) =>
    [
      gov2State.Rejected,
      gov2State.TimedOut,
      gov2State.Cancelled,
      gov2State.Killed,
      gov2State.Executed,
    ].includes(item.name),
  );
}

export function useDemocracyReferendumVotingFinishIndexer(timeline) {
  const finishItem = (timeline || []).find((item) =>
    ["Passed", "NotPassed"].includes(item.method),
  );

  return finishItem?.indexer;
}

// return the voting finish height if the voting is finished, else `undefined`.
export default function useReferendumVotingFinishHeight() {
  const indexer = useReferendumVotingFinishIndexer();
  return indexer?.blockHeight;
}

export function useReferendaIsVoting() {
  const onchainData = useOnchainData();
  return useMemo(() => {
    const name = onchainData?.state?.name;
    return gov2VotingStates.includes(name);
  }, [onchainData]);
}
