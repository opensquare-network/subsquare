import User from "next-common/components/user";
import SymbolBalance from "next-common/components/values/symbolBalance";
import { useEffect, useState } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "../../utils";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { createMotionTimelineData } from "../../utils/timeline/motion";
import sortTimeline from "next-common/utils/timeline/sort";

const getTimelineData = (args, method) => {
  switch (method) {
    case "BountyExtended":
      return {
        ...args,
        caller: <User add={args.caller} fontSize={14} />,
      };
    case "acceptCurator":
      return {
        ...args,
        curator: <User add={args.curator.id ?? args.curator} fontSize={14} />,
      };
    case "proposeBounty":
      return {
        ...args,
        value: <SymbolBalance value={args.value} />,
      };
    case "BountyRejected":
      return {
        ...args,
        slashed: <SymbolBalance value={args.slashed} />,
      };
    case "Proposed":
      return {
        Index: `#${args.index}`,
      };
    case "BountyClaimed":
      return {
        Beneficiary: <User add={args.beneficiary} fontSize={14} />,
        Payout: <SymbolBalance value={args.payout} />,
      };
    case "Awarded":
    case "BountyAwarded":
      return {
        Beneficiary: <User add={args.beneficiary} fontSize={14} />,
      };
  }
  return args;
};

export default function useBountyTimelineData(bounty) {
  const [timelineData, setTimelineData] = useState([]);
  useEffect(() => {
    const data = (bounty?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getTimelineStatus(
          detailPageCategory.TREASURY_BOUNTY,
          item.method ?? item.name,
        ),
        data: getTimelineData(item.args, item.method ?? item.name),
      };
    });

    const motions =
      bounty?.motions?.map((motion) => {
        return createMotionTimelineData(motion, true, "/council/motions");
      }) ?? [];

    setTimelineData(sortTimeline([...data, ...motions].filter(Boolean)));
  }, [bounty]);

  return timelineData;
}
