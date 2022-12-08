import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import User from "next-common/components/user";
import { parseGov2TrackName } from "next-common/utils/gov2";
import { getGov2ReferendumStateArgs } from "next-common/utils/gov2/result";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { useTimelineData } from "next-common/context/post";
import { detailPageCategory } from "next-common/utils/consts/business/category";

const getTimelineData = (args, method, trackInfo) => {
  switch (method) {
    case "Submitted": {
      return {
        Proposer: <User add={args.proposer} />,
        Track: parseGov2TrackName(trackInfo.name),
        "Proposal Hash":
          args.proposal?.legacy?.hash || args.proposal?.lookup?.hash,
      };
    }
    case "DecisionDepositPlaced": {
      return {
        Depositor: <User add={args.who} />,
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
      time: dayjs(item.indexer.blockTime).format("YYYY-MM-DD HH:mm:ss"),
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
  const filtered = timeline.filter(
    ({ name }) => name !== "DecisionDepositPlaced"
  );
  const timelineData = makeReferendumTimelineData(filtered, trackInfo);

  return <Timeline data={timelineData} />;
}
