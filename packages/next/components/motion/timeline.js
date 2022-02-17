import styled from "styled-components";
import findLastIndex from "lodash.findlastindex";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import useShowMotionEnd from "./useShowMotionEnd";
import MotionEnd from "next-common/components/motionEnd";
import Timeline from "next-common/components/timeline";

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
    (item) => item?.method === "Voted"
  );
  if (firstFoldIndex > 0) {
    firstFoldIndex--;
  }

  if (firstFoldIndex >= lastFoldIndex) {
    return timeline;
  }

  const foldItems = timeline.filter(
    (item, idx) => idx >= firstFoldIndex && idx <= lastFoldIndex
  );
  const notFoldItems = timeline.filter(
    (item, idx) => idx < firstFoldIndex || idx > lastFoldIndex
  );
  return [foldItems, ...notFoldItems];
};

export default function MotionTimeline({ motion, chain, type }) {
  if (!motion) {
    return null;
  }

  const showMotionEnd = useShowMotionEnd(motion, chain);
  const timeline = createMotionTimelineData(motion, chain);

  let timelineData;
  if (isClosed(timeline)) {
    timelineData = getClosedTimelineData(timeline);
  } else {
    timelineData = timeline;
  }

  const motionEndInfo = showMotionEnd ? (
    <TimelineMotionEnd>
      <MotionEnd type="simple" motion={motion} chain={chain} />
    </TimelineMotionEnd>
  ) : null;

  return (
    <Timeline
      motionEndInfo={motionEndInfo}
      data={timelineData}
      chain={chain}
      indent={false}
      type={type}
    />
  );
}
