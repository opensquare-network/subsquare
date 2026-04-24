import { useEffect, useState } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "next-common/utils/pages";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import sortTimeline from "next-common/utils/timeline/sort";
import AddressUser from "next-common/components/user/addressUser";
import Anchor from "next-common/components/styled/anchor";
import { omit } from "lodash-es";
import AssetDisplay from "next-common/components/treasury/multiAssetBounty/assetDisplay";

const getTimelineData = (args, method) => {
  switch (method) {
    case "ChildBountyCreated":
      return {
        ...omit(args, ["value", "assetKind"]),
        parentBountyId:
          args.parentBountyId != null ? (
            <Anchor
              href={`/treasury/multi-asset-bounties/${args.parentBountyId}`}
            >
              {args.parentBountyId}
            </Anchor>
          ) : undefined,
        value: <AssetDisplay value={args.value} assetKind={args.assetKind} />,
        curator: args.curator ? <AddressUser add={args.curator} /> : undefined,
      };
    case "CuratorProposed":
      return {
        Curator: args.curator ? <AddressUser add={args.curator} /> : undefined,
      };
    case "BountyBecameActive":
      return {
        ...args,
        curator: args.curator ? <AddressUser add={args.curator} /> : undefined,
      };
    case "BountyAwarded":
      return {
        Beneficiary: <AddressUser add={args.beneficiary} />,
      };
    case "BountyPayoutProcessed":
      return {
        Beneficiary: args.beneficiary ? (
          <AddressUser add={args.beneficiary} />
        ) : undefined,
        value: <AssetDisplay value={args.value} assetKind={args.assetKind} />,
      };
  }
  return args;
};

export default function useMultiAssetChildBountyTimelineData(bounty) {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const data = (bounty?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getTimelineStatus(
          detailPageCategory.MULTI_ASSET_CHILD_BOUNTY,
          item.method ?? item.name,
        ),
        data: getTimelineData(item.args, item.method ?? item.name),
      };
    });

    setTimelineData(sortTimeline(data.filter(Boolean)));
  }, [bounty]);

  return timelineData;
}
