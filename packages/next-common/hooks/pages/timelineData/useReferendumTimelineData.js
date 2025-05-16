import { useMemo } from "react";
import { startCase } from "lodash-es";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import AddressUser from "next-common/components/user/addressUser";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import { useOnchainData, useTimelineData } from "next-common/context/post";
import { detailPageCategory } from "next-common/utils/consts/business/category";

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

function makeReferendumTimelineData(timeline, trackInfo) {
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

// Logic sourced from components/gov2/timeline
export default function useReferendumTimelineData() {
  const timeline = useTimelineData();
  const onchainData = useOnchainData();
  const timelineData = useMemo(() => {
    return makeReferendumTimelineData(timeline, onchainData?.trackInfo);
  }, [onchainData.trackInfo, timeline]);
  return timelineData;
}
