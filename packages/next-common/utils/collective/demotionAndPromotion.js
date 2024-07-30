export function getDemotionPeriod(rank, params) {
  return rank <= 0 ? params.offboardTimeout : params.demotionPeriod[rank - 1];
}

export function getPromotionPeriod(rank, params) {
  const toRank = rank + 1;
  const index = toRank > 0 ? toRank - 1 : 0;
  return params.minPromotionPeriod[index];
}

export function getGoneBlocksPercentage(goneBlocks, totalBlocks) {
  if (goneBlocks <= 0) {
    return 0;
  } else if (goneBlocks >= totalBlocks) {
    return 100;
  } else {
    return Number((goneBlocks / totalBlocks) * 100).toFixed(2);
  }
}

export function getRemainingBlocks(goneBlocks, totalBlocks) {
  if (goneBlocks <= 0) {
    return totalBlocks;
  } else if (goneBlocks >= totalBlocks) {
    return 0;
  } else {
    return totalBlocks - goneBlocks;
  }
}
