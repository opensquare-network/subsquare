import User from "next-common/components/user";
import { getTimelineStatus } from "utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import sortTimeline from "next-common/utils/timeline/sort";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";

export default function TreasuryProposalTimeline({ treasuryProposal }) {
  const getTimelineData = (args, method) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Awarded":
        return {
          Beneficiary: <User add={args.beneficiary} />,
          Award: <SymbolBalance value={args.award} />,
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
          link: `/democracy/proposal/${item.args.index}`,
          type: detailPageCategory.DEMOCRACY_PROPOSAL,
        },
        voting: {
          proposer: publicProposal.proposer,
          method: publicProposal.preImage?.call.method,
          args: publicProposal.preImage?.call.args,
        },
        method: item.method,
        link: `/democracy/proposal/${item.args.index}`,
      })),
      ...getDemocracyTimelineData(
        completeTimeline.slice(1),
        detailPageCategory.DEMOCRACY_REFERENDUM
      ),
    ];
    timelineData.push(publicProposalTimelineData);
  });
  sortTimeline(timelineData);

  return <Timeline data={timelineData} indent={false} />;
}
