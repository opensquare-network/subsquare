import User from "next-common/components/user";
import { getNode, toPrecision } from "utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import { getTimelineStatus } from "utils";
import { TYPE_TREASURY_PROPOSAL } from "utils/viewConstants";
import sortTimeline from "next-common/utils/timeline/sort";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";

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

  treasuryProposal?.publicProposals?.forEach((publicProposal) => {
    const completeTimeline = (publicProposal.timeline || []).concat(
      publicProposal.democracyReferendum?.timeline || []
    );

    const publicProposalTimelineData = [
      ...completeTimeline.slice(0, 1).map((item) => ({
        indexer: item.indexer,
        index: item.args.index,
        time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
        status: {
          value: `Public proposal #${item.args.index}`,
          color: "#6848FF",
        },
        voting: {
          proposer: publicProposal.proposer,
          method: publicProposal.preImage?.call.method,
          args: publicProposal.preImage?.call.args,
        },
        method: item.method,
        link: `/democracy/proposal/${item.args.index}`,
      })),
      ...getDemocracyTimelineData(completeTimeline.slice(1), chain),
    ];
    timelineData.push(publicProposalTimelineData);
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
