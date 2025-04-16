import { getTimelineStatus } from "next-common/utils/index";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useTimelineData } from "next-common/context/post";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useMemo } from "react";
import SymbolBalance from "next-common/components/values/symbolBalance";
import sortTimeline from "next-common/utils/timeline/sort";

function makePublicProposalTimelineData(timeline) {
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
      time: formatTime(item.indexer.blockTime),
      indexer: item.indexer,
      status: getTimelineStatus(
        detailPageCategory.DEMOCRACY_PROPOSAL,
        item.method ?? item.name,
      ),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });
  sortTimeline(timelineData);

  return timelineData;
}

// Logic sourced from components/publicProposal/timeline
export default function useDemocracyPublicProposalTimelineData() {
  const timeline = useTimelineData();
  return useMemo(() => makePublicProposalTimelineData(timeline), [timeline]);
}
