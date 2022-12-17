import { useTimelineData } from "../index";
import { gov2State } from "../../../utils/consts/state";

// return the voting finish height if the voting is finished, else `undefined`.
export default function useReferendumVotingFinishHeight() {
  const timeline = useTimelineData();
  const finishItem = (timeline || []).find((item) =>
    [
      gov2State.Approved,
      gov2State.Rejected,
      gov2State.TimedOut,
      gov2State.Cancelled,
      gov2State.Killed,
      "Confirmed",
    ].includes(item.name)
  );

  return finishItem?.indexer?.blockHeight;
}
