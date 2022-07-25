import User from "next-common/components/user";
import { getNode, toPrecision } from "utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import { getTimelineStatus } from "utils";
import { TYPE_TREASURY_PROPOSAL } from "utils/viewConstants";
import { createMotionTimelineData } from "utils/timeline/motion";
import sortTimeline from "utils/timeline/sort";

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
      status: getTimelineStatus("proposal", item.method ?? item.name),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  treasuryProposal?.motions?.forEach((motion) => {
    const motionTimelineData = createMotionTimelineData(motion, chain);
    timelineData.push(motionTimelineData);
  });
  sortTimeline(timelineData);

  return (
    <Timeline
      data={timelineData}
      chain={chain}
      type={TYPE_TREASURY_PROPOSAL}
      indent={false}
    />
  );
}
