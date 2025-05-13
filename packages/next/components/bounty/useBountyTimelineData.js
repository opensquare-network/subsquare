import SymbolBalance from "next-common/components/values/symbolBalance";
import { useEffect, useState } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "next-common/utils/pages";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { createMotionTimelineData } from "next-common/utils/pages/timeline/motion";
import sortTimeline from "next-common/utils/timeline/sort";
import AddressUser from "next-common/components/user/addressUser";

const getTimelineData = (args, method) => {
  switch (method) {
    case "BountyExtended":
      return {
        ...args,
        caller: <AddressUser add={args.caller} />,
      };
    case "acceptCurator":
      return {
        ...args,
        curator: <AddressUser add={args.curator.id ?? args.curator} />,
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
        Beneficiary: <AddressUser add={args.beneficiary} />,
        Payout: <SymbolBalance value={args.payout} />,
      };
    case "Awarded":
    case "BountyAwarded":
      return {
        Beneficiary: <AddressUser add={args.beneficiary} />,
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
