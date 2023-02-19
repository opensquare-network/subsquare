import dayjs from "dayjs";
import { useDetailType } from "../../../context/page";
import sortTimeline from "../../../utils/timeline/sort";
import Timeline from "../../timeline";
import { createMotionTimelineData } from "@subsquare/next/utils/timeline/motion";

export default function AnnouncementTimeline({ data }) {
  const type = useDetailType();

  const { timeline = [], motion } = data;
  const timelineData = timeline.map(item => {
    const { indexer, method, args } = item;
    return {
      indexer: item.indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: { value: method, type },
      data: args,
    };
  })
  const motionTimeline = createMotionTimelineData(motion, true, "/alliance/motion");
  timelineData.push(motionTimeline);
  sortTimeline(timelineData);
  return <Timeline data={timelineData} indent={false} />;
}
