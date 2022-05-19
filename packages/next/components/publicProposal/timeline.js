import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import sortTimeline from "utils/timeline/sort";
import { getNode, getTimelineStatus, toPrecision } from "utils";

export function makePublicProposalTimelineData(timeline, chain) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const getTimelineData = (args, method, chain) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Tabled":
        return {
          "Referenda Index": `#${args.referendumIndex}`,
          Deposit: `${toPrecision(args.deposit ?? 0, decimals)} ${symbol}`,
          Depositors: (args.depositors || []).length,
        };
    }
    return args;
  };

  const timelineData = (timeline || []).map((item) => {
    return {
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      indexer: item.indexer,
      status: getTimelineStatus("proposal", item.method ?? item.name),
      data: getTimelineData(item.args, item.method ?? item.name, chain),
    };
  });
  sortTimeline(timelineData);

  return timelineData;
}

export default function PublicProposalTimeline({ timeline, chain }) {
  const timelineData = makePublicProposalTimelineData(timeline, chain);

  return <Timeline data={timelineData} chain={chain} />;
}
