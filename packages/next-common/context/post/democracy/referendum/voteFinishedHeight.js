import { useTimelineData } from "../../index";
import { referendumVoteFinishedStatusArray } from "../../../../utils/democracy/referendum";

export default function useDemocracyVoteFinishedHeight() {
  const timeline = useTimelineData();
  const item = (timeline || []).find(
    (item) => referendumVoteFinishedStatusArray.includes(item.name || item.method)
  );
  return item?.indexer?.blockHeight;
}
