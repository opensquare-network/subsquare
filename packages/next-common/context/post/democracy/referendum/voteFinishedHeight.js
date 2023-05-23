import { useTimelineData } from "../../index";
import { referendumVoteFinishedStatusArray } from "../../../../utils/democracy/referendum";

export default function useDemocracyVoteFinishedHeight() {
  const timeline = useTimelineData();
  const item = (timeline || []).find((item) => referendumVoteFinishedStatusArray.includes(item.name));
  return item?.indexer?.blockHeight;
}
