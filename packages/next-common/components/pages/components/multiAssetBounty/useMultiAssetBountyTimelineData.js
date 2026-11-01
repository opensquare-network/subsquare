import { useEffect, useState } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "next-common/utils/pages";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import sortTimeline from "next-common/utils/timeline/sort";
import AddressUser from "next-common/components/user/addressUser";
import { omit } from "lodash-es";
import AssetDisplay from "next-common/components/treasury/multiAssetBounty/assetDisplay";
import { useChain } from "next-common/context/chain";
import { extractAddressFromXcmAccountLocation } from "next-common/utils/xcm/address";

function renderAddressUser(value, chain) {
  const address = extractAddressFromXcmAccountLocation(value, chain);
  return address ? <AddressUser add={address} /> : undefined;
}

const getTimelineData = (args = {}, method, chain) => {
  switch (method) {
    case "BountyCreated":
      return {
        ...omit(args, ["metadata", "value", "assetKind"]),
        value: <AssetDisplay value={args.value} assetKind={args.assetKind} />,
        curator: renderAddressUser(args.curator, chain),
      };
    case "CuratorProposed":
      return {
        Curator: renderAddressUser(args.curator, chain),
      };
    case "BountyBecameActive":
      return {
        ...args,
        curator: renderAddressUser(args.curator, chain),
      };
    case "BountyAwarded":
      return {
        Beneficiary: renderAddressUser(args.beneficiary, chain),
      };
    case "BountyPayoutProcessed":
      return {
        Beneficiary: renderAddressUser(args.beneficiary, chain),
        value: <AssetDisplay value={args.value} assetKind={args.assetKind} />,
      };
  }
  return args;
};

export default function useMultiAssetBountyTimelineData(bounty) {
  const [timelineData, setTimelineData] = useState([]);
  const chain = useChain();

  useEffect(() => {
    const data = (bounty?.timeline || []).map((item) => {
      const indexer = item.extrinsicIndexer ?? item.indexer;
      return {
        indexer,
        time: formatTime(indexer?.blockTime),
        status: getTimelineStatus(
          detailPageCategory.MULTI_ASSET_BOUNTY,
          item.method ?? item.name,
        ),
        data: getTimelineData(item.args, item.method ?? item.name, chain),
      };
    });

    setTimelineData(sortTimeline(data.filter(Boolean)));
  }, [bounty, chain]);

  return timelineData;
}
