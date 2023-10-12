import sortTimeline from "next-common/utils/timeline/sort";
import Timeline from "next-common/components/timeline";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { detailMultiTabsIsTimelineCompactModeSelector } from "next-common/store/reducers/detailSlice";

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

  const isTimelineCompact = useSelector(
    detailMultiTabsIsTimelineCompactModeSelector,
  );
  sortTimeline(all);

  return <Timeline data={all} compact={isTimelineCompact} />;
}
