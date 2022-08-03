import sortTimeline from "next-common/utils/timeline/sort";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";

export default function PublicProposalTimeline({
  publicProposalTimeline,
  referendumTimeline,
  chain,
}) {
  const completeTimeline = (publicProposalTimeline || []).concat(
    referendumTimeline || []
  );
  const timelineData = getDemocracyTimelineData(completeTimeline, chain);
  sortTimeline(timelineData);

  return <Timeline data={timelineData} chain={chain} />;
}
