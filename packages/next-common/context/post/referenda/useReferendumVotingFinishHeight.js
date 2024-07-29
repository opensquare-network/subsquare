import { useTimelineData } from "../index";
import { gov2State } from "../../../utils/consts/state";

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

// return the voting finish height if the voting is finished, else `undefined`.
export default function useReferendumVotingFinishHeight() {
  const indexer = useReferendumVotingFinishIndexer();
  return indexer?.blockHeight;
}
