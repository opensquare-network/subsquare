import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import { multiAssetChildBountyBaseUrl } from "../../postBaseUrl";

export function getMultiAssetChildBountyIndex(item) {
  if (item.onchainData?.hasSameParentAndIndex) {
    return `${item.parentBountyId}_${item.index}_${item.indexer?.blockHeight}`;
  }
  return `${item.parentBountyId}_${item.index}`;
}

export function getMultiAssetChildBountyDisplayIndex(item) {
  return `${item.parentBountyId}_${item.index}`;
}

export default function normalizeMultiAssetChildBountyListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    index: getMultiAssetChildBountyDisplayIndex(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${multiAssetChildBountyBaseUrl}/${getMultiAssetChildBountyIndex(
      item,
    )}`,
    value: item.onchainData?.value,
    assetKind: item.onchainData?.assetKind,
    parentIndex: item.parentBountyId,
  };
}
