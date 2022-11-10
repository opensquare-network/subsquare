import User from "next-common/components/user";
import { getTimelineStatus } from "utils";
import { toPrecision } from "next-common/utils";
import dayjs from "dayjs";
import Timeline from "next-common/components/timeline";
import sortTimeline from "next-common/utils/timeline/sort";
import Anchor from "next-common/components/styled/anchor";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import { useChainSettings } from "next-common/context/chain";

export default function ChildBountyTimeline({ chain, onchainData }) {
  const { decimals, symbol } = useChainSettings();
  const getTimelineData = (args, method, indexer) => {
    switch (method) {
      case "Added":
        return {
          ...args,
          parentBountyId: (
            <Anchor href={`/treasury/bounty/${args.parentBountyId}`}>
              {" "}
              {args.parentBountyId}{" "}
            </Anchor>
          ),
          value: `${toPrecision(args.value, decimals)} ${symbol}`,
        };
      case "proposeCurator":
      case "acceptCurator":
        return {
          Curator: <User add={args.curator.id ?? args.curator} fontSize={14} />,
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
      case "Awarded":
        const AwardedTimelineNode = {
          Beneficiary: <User add={args.beneficiary} fontSize={14} />,
        };
        if (onchainData?.state?.state === "PendingPayout") {
          AwardedTimelineNode.PendingPayout = (
            <TreasuryCountDown
              startHeight={indexer?.blockHeight}
              targetHeight={onchainData.unlockAt}
              prefix="Claimable"
            />
          );
        }
        return AwardedTimelineNode;
      case "BountyClaimed":
      case "Claimed":
        return {
          Beneficiary: <User add={args.beneficiary} fontSize={14} />,
          Payout: `${toPrecision(args.payout ?? 0, decimals)} ${symbol}`,
        };
    }
    return args;
  };

  const timelineData = (onchainData?.timeline || []).map((item) => {
    const indexer = item.extrinsicIndexer ?? item.indexer;
    return {
      indexer,
      time: dayjs(indexer?.blockTime).format("YYYY-MM-DD HH:mm:ss"),
      status: getTimelineStatus(
        detailPageCategory.TREASURY_CHILD_BOUNTY,
        item.method ?? item.name
      ),
      data: getTimelineData(item.args, item.method ?? item.name, indexer),
    };
  });
  sortTimeline(timelineData);

  return (
    <Timeline
      data={timelineData}
      chain={chain}
      type={detailPageCategory.TREASURY_CHILD_BOUNTY}
    />
  );
}
