import { getTimelineStatus } from "utils";
import sortTimeline from "next-common/utils/timeline/sort";
import Anchor from "next-common/components/styled/anchor";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import TreasuryCountDown from "next-common/components/treasury/common/countdown";
import SymbolBalance from "next-common/components/values/symbolBalance";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { useCallback, useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import { usePostOnChainData } from "next-common/context/post";

// Logic course from packages/next/components/childBounty/timeline.js
export default function useTreasuryChildBountiesTimelineData() {
  const onchainData = usePostOnChainData();
  const getTimelineData = useCallback(
    (args, method, indexer) => {
      switch (method) {
        case "Added":
          return {
            ...args,
            parentBountyId: (
              <Anchor href={`/treasury/bounties/${args.parentBountyId}`}>
                {args.parentBountyId}
              </Anchor>
            ),
            description: (
              <span className="font-medium">{args.description}</span>
            ),
            value: <SymbolBalance value={args.value} />,
          };
        case "proposeCurator":
        case "acceptCurator":
          return {
            Curator: <AddressUser add={args.curator.id ?? args.curator} />,
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
        case "Awarded":
          // eslint-disable-next-line no-case-declarations
          const AwardedTimelineNode = {
            Beneficiary: <AddressUser add={args.beneficiary} />,
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
            Beneficiary: <AddressUser add={args.beneficiary} />,
            Payout: <SymbolBalance value={args.payout} />,
          };
      }
      return args;
    },
    [onchainData],
  );

  const timelineData = useMemo(() => {
    const data = (onchainData?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getTimelineStatus(
          detailPageCategory.TREASURY_CHILD_BOUNTY,
          item.method ?? item.name,
        ),
        data: getTimelineData(item.args, item.method ?? item.name, indexer),
      };
    });
    return sortTimeline(data);
  }, [getTimelineData, onchainData?.timeline]);
  return timelineData;
}
