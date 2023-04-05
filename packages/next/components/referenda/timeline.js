import Timeline from "next-common/components/timeline";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useTimelineData } from "next-common/context/post";
import formatTime from "next-common/utils/viewfuncs/formatDate";

const getTimelineData = (args, method) => {
  switch (method) {
    case "Executed":
      const rawResult = args.result;
      let result;
      if (typeof rawResult === "boolean") {
        result = rawResult;
      } else if (typeof args.result === "object") {
        result = Object.keys(rawResult)[0];
      } else {
        result = JSON.stringify(rawResult);
      }

      return { result };
  }

  return args;
};

export function makeReferendumTimelineData(timeline) {
  return (timeline || []).map((item) => {
    return {
      time: formatTime(item.indexer.blockTime),
      indexer: item.indexer,
      status: {
        value: item.method ?? item.name,
        type: detailPageCategory.DEMOCRACY_REFERENDUM,
      },
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });
}

export default function ReferendumTimeline() {
  const timeline = useTimelineData();
  const timelineData = makeReferendumTimelineData(timeline);

  return <Timeline data={timelineData} />;
}
