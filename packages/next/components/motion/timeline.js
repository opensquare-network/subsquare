import styled from "styled-components";
import { findLastIndex } from "lodash-es";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import useShowMotionEnd from "./useShowMotionEnd";
import MotionEnd from "next-common/components/motionEnd";
import Timeline from "next-common/components/timeline";
import { usePostOnChainData } from "next-common/context/post";
import { useEffect, useState } from "react";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs";

const TimelineMotionEnd = styled.div`
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 8px;
  }
`;

const isClosed = (timeline) => {
  return (timeline || []).some((item) => item.method === "Closed");
};

const getClosedTimelineData = (timeline = []) => {
  let firstFoldIndex = timeline.findIndex((item) => item?.method === "Voted");
  const lastFoldIndex = findLastIndex(
    timeline,
    (item) => item?.method === "Voted",
  );
  if (firstFoldIndex > 0) {
    firstFoldIndex--;
  }

  if (firstFoldIndex >= lastFoldIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstFoldIndex && idx <= lastFoldIndex,
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstFoldIndex || idx > lastFoldIndex,
  );
  return [foldItems, ...notFoldItems];
};

export function makeMotionTimelineData(motion) {
  if (!motion) {
    return null;
  }

  const timeline = createMotionTimelineData(motion);

  let timelineData = timeline;
  if (isClosed(timeline)) {
    timelineData = getClosedTimelineData(timeline);
  }

  return timelineData;
}

export default function MotionTimeline() {
  const motion = usePostOnChainData();
  const showMotionEnd = useShowMotionEnd(motion);
  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => setTimelineData(makeMotionTimelineData(motion)), [motion]);

  const isTimelineCompact = useIsTimelineCompact();

  if (!motion) {
    return null;
  }

  const motionEndInfo = showMotionEnd ? (
    <TimelineMotionEnd>
      <MotionEnd type="simple" motion={motion} />
    </TimelineMotionEnd>
  ) : null;

  return (
    <Timeline
      motionEndInfo={motionEndInfo}
      data={timelineData}
      indent={false}
      compact={isTimelineCompact}
    />
  );
}
