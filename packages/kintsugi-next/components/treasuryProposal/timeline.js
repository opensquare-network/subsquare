import { getTimelineStatus } from "utils";
import Timeline from "next-common/components/timeline";
import sortTimeline from "next-common/utils/timeline/sort";
import { getDemocracyTimelineData } from "utils/timeline/democracyUtil";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useEffect, useState } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs";

export default function TreasuryProposalTimeline({ treasuryProposal }) {
  const getTimelineData = (args, method) => {
    switch (method) {
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "Awarded":
        return {
          Beneficiary: <AddressUser add={args.beneficiary} />,
          Award: <SymbolBalance value={args.award} />,
        };
    }
    return args;
  };

  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    const data = (treasuryProposal?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getTimelineStatus(
          detailPageCategory.TREASURY_PROPOSAL,
          item.method ?? item.name,
        ),
        data: getTimelineData(item.args, item.method ?? item.name),
      };
    });

    const publicProposalTimelines =
      treasuryProposal?.publicProposals?.map((publicProposal) => {
        const completeTimeline = (publicProposal.timeline || []).concat(
          publicProposal.democracyReferendum?.timeline || [],
        );

        return [
          ...completeTimeline.slice(0, 1).map((item) => ({
            indexer: item.indexer,
            index: item.args.index,
            time: formatTime(item.indexer.blockTime),
            status: {
              value: `Public proposal #${item.args.index}`,
              link: `/democracy/proposals/${item.args.index}`,
              type: detailPageCategory.DEMOCRACY_PROPOSAL,
            },
            voting: {
              proposer: publicProposal.proposer,
              method: publicProposal.preImage?.call.method,
              args: publicProposal.preImage?.call.args,
            },
            method: item.method,
            link: `/democracy/proposals/${item.args.index}`,
          })),
          ...getDemocracyTimelineData(
            completeTimeline.slice(1),
            detailPageCategory.DEMOCRACY_REFERENDUM,
          ),
        ];
      }) ?? [];

    setTimelineData(sortTimeline([...data, ...publicProposalTimelines]));
  }, [treasuryProposal]);

  const isTimelineCompact = useIsTimelineCompact();

  return (
    <Timeline data={timelineData} indent={false} compact={isTimelineCompact} />
  );
}
