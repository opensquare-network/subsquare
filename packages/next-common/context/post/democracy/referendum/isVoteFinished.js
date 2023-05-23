import { useTimelineData } from "../../index";
import { referendumVoteFinishedStatusArray } from "../../../../utils/democracy/referendum";

// check whether democracy referendum voting period is finished
export default function useIsDemocracyVoteFinished() {
  const timeline = useTimelineData();
  return (timeline || []).some((item) => referendumVoteFinishedStatusArray.includes(item.method));
}
