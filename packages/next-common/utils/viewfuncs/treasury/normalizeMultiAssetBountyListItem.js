import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { multiAssetBountyBaseUrl } from "../../postBaseUrl";

export default function normalizeMultiAssetBountyListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    index: item.bountyIndex,
    address: item.onchainData?.curator,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${multiAssetBountyBaseUrl}/${item.bountyIndex}`,
    value: item.onchainData?.value,
    assetKind: item.onchainData?.assetKind,
  };
}
