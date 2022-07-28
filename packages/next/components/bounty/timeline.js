import User from "next-common/components/user";
import { getNode, getTimelineStatus, toPrecision } from "utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import { TYPE_TREASURY_BOUNTY } from "utils/viewConstants";
import { createMotionTimelineData } from "utils/timeline/motion";
import sortTimeline from "next-common/utils/timeline/sort";
import { detailPageCategory } from "next-common/utils/consts/business/category";

export default function BountyTimeline({ chain, bounty }) {
  const node = getNode(chain);
  if (!node) {
    return null;
  }
  const decimals = node.decimals;
  const symbol = node.symbol;

  const getTimelineData = (args, method) => {
    switch (method) {
      case "BountyExtended":
        return {
          ...args,
          caller: <User chain={chain} add={args.caller} fontSize={14} />,
        };
      case "acceptCurator":
        return {
          ...args,
          curator: <User chain={chain} add={args.curator} fontSize={14} />,
        };
      case "proposeBounty":
        return {
          ...args,
          value: `${toPrecision(args.value ?? 0, decimals)} ${symbol}`,
        };
      case "BountyRejected":
        return {
          ...args,
          slashed: `${toPrecision(args.slashed ?? 0, decimals)} ${symbol}`,
        };
      case "Proposed":
        return {
          Index: `#${args.index}`,
        };
      case "BountyClaimed":
        return {
          Beneficiary: (
            <User chain={chain} add={args.beneficiary} fontSize={14} />
          ),
          Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
        };
      case "Awarded":
      case "BountyAwarded":
        return {
          Beneficiary: (
            <User chain={chain} add={args.beneficiary} fontSize={14} />
          ),
          Award: `${toPrecision(args.award ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  const timelineData = (bounty?.timeline || []).map((item) => {
    const indexer = item.extrinsicIndexer ?? item.indexer;
    return {
      indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: getTimelineStatus(
        detailPageCategory.TREASURY_BOUNTY,
        item.method ?? item.name
      ),
      data: getTimelineData(item.args, item.method ?? item.name),
    };
  });

  const motions = bounty?.motions?.map((motion) => {
    return createMotionTimelineData(motion, chain, true, "/council/motion");
  });
  timelineData.push(...motions);
  sortTimeline(timelineData);

  return (
    <Timeline data={timelineData} chain={chain} type={TYPE_TREASURY_BOUNTY} />
  );
}
