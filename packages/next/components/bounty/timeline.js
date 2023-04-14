import User from "next-common/components/user";
import { getTimelineStatus } from "utils";
import Timeline from "next-common/components/timeline";
import { createMotionTimelineData } from "utils/timeline/motion";
import sortTimeline from "next-common/utils/timeline/sort";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useMemo } from "react";

export default function BountyTimeline({ bounty }) {
  const getTimelineData = (args, method) => {
    switch (method) {
      case "BountyExtended":
        return {
          ...args,
          // caller: <User add={args.caller} fontSize={14} />,
          caller: null,
        };
      case "acceptCurator":
        return {
          ...args,
          // curator: <User add={args.curator.id ?? args.curator} fontSize={14} />,
          caller: null,
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
          // Beneficiary: <User add={args.beneficiary} fontSize={14} />,
          Beneficiary: null,
          Payout: <SymbolBalance value={args.payout} />,
        };
      case "Awarded":
      case "BountyAwarded":
        return {
          // Beneficiary: <User add={args.beneficiary} fontSize={14} />,
          Beneficiary: null,
        };
    }
    return args;
  };

  const timelineData = useMemo(() => {
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

    const motions = bounty?.motions?.map((motion) => {
      return createMotionTimelineData(motion, true, "/council/motion");
    });

    sortTimeline(data);
    return sortTimeline([...data, ...motions]);
  }, [bounty]);

  return <Timeline data={timelineData} />;
}
