import sortTimeline from "next-common/utils/timeline/sort";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function PublicProposalTimeline({
  publicProposalTimeline = [],
  referendumTimeline = [],
}) {
  const proposal = getDemocracyTimelineData(publicProposalTimeline);
  const referendum = getDemocracyTimelineData(
    referendumTimeline,
    detailPageCategory.DEMOCRACY_REFERENDUM,
  );
  const all = [...proposal, ...referendum];

  sortTimeline(all);

  return <Timeline data={all} />;
}
