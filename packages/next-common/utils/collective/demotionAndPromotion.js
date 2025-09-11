import BigNumber from "bignumber.js";
import { ONE_DAY } from "../constants";
import rankToIndex from "../fellowship/rankToIndex";

const days20 = 20 * ONE_DAY;
const days30 = 30 * ONE_DAY;

export function getDemotionPeriod(rank, params) {
  return rank <= 0
    ? params.offboardTimeout
    : params.demotionPeriod?.[rankToIndex(rank)];
}

export function getPromotionPeriod(rank, params) {
  const toRank = rank + 1;
  const index = rankToIndex(toRank);
  return params.minPromotionPeriod?.[index];
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

export function isDemotionAboutToExpire({
  lastProof,
  rank,
  params,
  blockTime,
  latestHeight,
}) {
  const demotionPeriod = getDemotionPeriod(rank, params);
  const gone = latestHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);

  return (
    demotionPeriod > 0 &&
    remainingBlocks > 0 &&
    new BigNumber(blockTime)
      .multipliedBy(remainingBlocks)
      .lte(rank <= 0 ? days30 : days20)
  );
}

export function isDemotionExpired({ lastProof, rank, params, latestHeight }) {
  const demotionPeriod = getDemotionPeriod(rank, params);
  const gone = latestHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);

  return demotionPeriod > 0 && remainingBlocks <= 0;
}

export function isPromotable({ lastPromotion, rank, latestHeight, params }) {
  const promotionPeriod = getPromotionPeriod(rank, params);
  const gone = latestHeight - lastPromotion;
  const remainingBlocks = getRemainingBlocks(gone, promotionPeriod);

  return promotionPeriod > 0 && remainingBlocks <= 0;
}
