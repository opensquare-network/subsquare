import Timeline from "next-common/components/timeline";
import { startCase } from "lodash-es";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { useTimelineData } from "next-common/context/post";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useEffect, useState } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { useIsTimelineCompact } from "next-common/components/detail/detailMultiTabs/timelineModeTabs";

const getTimelineData = (args, method, trackInfo) => {
  switch (method) {
    case "Submitted": {
      return {
        Proposer: <AddressUser add={args.proposer} />,
        Track: startCase(trackInfo.name),
        "Proposal Hash":
          args.proposal?.legacy?.hash ||
          args.proposal?.lookup?.hash ||
          args.proposalHash,
      };
    }
    case "DecisionDepositPlaced": {
      return {
        Depositor: <AddressUser add={args.who} />,
        Deposit: <SymbolBalance value={args.amount} />,
      };
    }
    case "DecisionStarted":
    case "Confirmed":
    case "Cancelled":
    case "Killed":
    case "Rejected":
    case "TimedOut": {
      return {};
    }
    case "Executed": {
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
  }

  return args;
};

export function makeReferendumTimelineData(timeline, trackInfo) {
  return (timeline || []).map((item) => {
    return {
      time: formatTime(item.indexer.blockTime),
      indexer: item.indexer,
      status: {
        value: item.method ?? item.name,
        type: detailPageCategory.GOV2_REFERENDUM,
        args: getGov2ReferendumStateArgs(item),
      },
      data: getTimelineData(item.args, item.method ?? item.name, trackInfo),
    };
  });
}

export default function ReferendumTimeline({ trackInfo }) {
  const timeline = useTimelineData();
  const [timelineData, setTimelineData] = useState([]);
  useEffect(
    () => setTimelineData(makeReferendumTimelineData(timeline, trackInfo)),
    [timeline, trackInfo],
  );

  const isTimelineCompact = useIsTimelineCompact();

  return <Timeline data={timelineData} compact={isTimelineCompact} />;
}
