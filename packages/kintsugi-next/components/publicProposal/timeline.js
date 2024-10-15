import sortTimeline from "next-common/utils/timeline/sort";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs";

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

  const isTimelineCompact = useIsTimelineCompact();
  sortTimeline(all);

  return <Timeline data={all} compact={isTimelineCompact} />;
}
