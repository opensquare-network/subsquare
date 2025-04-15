import { findLastIndex } from "lodash-es";
import { createMotionTimelineData } from "utils/timeline/motion";
import { usePostOnChainData } from "next-common/context/post";

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

function makeMotionTimelineData(motion) {
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

// Logic sourced from packages/next/components/motion/timeline.js
export default function useMotionTimelineData() {
  const motion = usePostOnChainData();

  return makeMotionTimelineData(motion);
}
