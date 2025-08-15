export function getChildBountyIndex(item) {
  if (item.onchainData?.hasSameParentAndIndex) {
    return `${item.parentBountyId}_${item.index}_${item.indexer.blockHeight}`;
  }
  return `${item.parentBountyId}_${item.index}`;
}

export function getChildBountyDisplayIndex(item) {
  return `${item.parentBountyId}_${item.index}`;
}
