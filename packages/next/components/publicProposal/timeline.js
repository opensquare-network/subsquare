import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import sortTimeline from "next-common/utils/timeline/sort";
import { getTimelineStatus } from "utils";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { useTimelineData } from "next-common/context/post";

export function makePublicProposalTimelineData(timeline) {
  const getTimelineData = (args, method) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Tabled":
        return {
          "Referendum Index": `#${args.referendumIndex}`,
          Deposit: <SymbolBalance value={args.deposit} />,
          Depositors: (args.depositors || []).length,
        };
    }
    return args;
  };

  const timelineData = (timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus(
        detailPageCategory.DEMOCRACY_PROPOSAL,
        item.method ?? item.name
      ),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });
  sortTimeline(timelineData);

  return timelineData;
}

export default function PublicProposalTimeline() {
  const timeline = useTimelineData();
  const timelineData = makePublicProposalTimelineData(timeline);

  return <Timeline data={timelineData} />;
}
