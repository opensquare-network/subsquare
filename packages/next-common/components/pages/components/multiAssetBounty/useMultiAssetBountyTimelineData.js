import { useEffect, useState } from "react";
import formatTime from "next-common/utils/viewfuncs/formatDate";
import { getTimelineStatus } from "next-common/utils/pages";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import sortTimeline from "next-common/utils/timeline/sort";
import AddressUser from "next-common/components/user/addressUser";
import { omit } from "lodash-es";
import AssetDisplay from "next-common/components/treasury/multiAssetBounty/assetDisplay";

const getTimelineData = (args, method) => {
  switch (method) {
    case "BountyCreated":
      return {
        ...omit(args, ["metadata", "value", "assetKind"]),
        value: <AssetDisplay value={args.value} assetKind={args.assetKind} />,
        curator: args.curator ? <AddressUser add={args.curator} /> : undefined,
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
  }
  return args;
};

export default function useMultiAssetBountyTimelineData(bounty) {
  const [timelineData, setTimelineData] = useState([]);

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
        data: getTimelineData(item.args, item.method ?? item.name),
      };
    });

    setTimelineData(sortTimeline(data.filter(Boolean)));
  }, [bounty]);

  return timelineData;
}
