import User from "next-common/components/user";
import { getTimelineStatus } from "utils";
import { getNode, toPrecision } from "next-common/utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import { createMotionTimelineData } from "utils/timeline/motion";
import sortTimeline from "next-common/utils/timeline/sort";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function TreasuryProposalTimeline({ chain, treasuryProposal }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const getTimelineData = (args, method) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Awarded":
        return {
          Beneficiary: <User chain={chain} add={args.beneficiary} />,
          Award: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  const timelineData = (treasuryProposal?.timeline || []).map((item) => {
    const indexer = item.extrinsicIndexer ?? item.indexer;
    return {
      indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: getTimelineStatus(
        detailPageCategory.TREASURY_PROPOSAL,
        item.method ?? item.name
      ),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  const motions = treasuryProposal?.motions?.map((motion) => {
    return createMotionTimelineData(motion, chain, true, "/council/motion");
  });
  timelineData.push(...motions);
  sortTimeline(timelineData);

  return <Timeline data={timelineData} chain={chain} indent={false} />;
}
