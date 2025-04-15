import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useTimelineData } from "next-common/context/post";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useMemo } from "react";

const getTimelineData = (args, method) => {
  switch (method) {
    case "Executed":
      // eslint-disable-next-line no-case-declarations
      const rawResult = args.result;
      // eslint-disable-next-line no-case-declarations
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

function makeReferendumTimelineData(timeline) {
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

export default function useDemocracyReferendaProposalTimelineData() {
  const timeline = useTimelineData();
  return useMemo(() => makeReferendumTimelineData(timeline), [timeline]);
}
