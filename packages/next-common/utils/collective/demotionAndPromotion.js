import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { DAY } from "../consts/time";
import rankToIndex from "../fellowship/rankToIndex";

const days20 = 20 * DAY;
const days30 = 30 * DAY;

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
  if (isNil(latestHeight)) {
    return false;
  }

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
  if (isNil(latestHeight)) {
    return false;
  }

  const demotionPeriod = getDemotionPeriod(rank, params);
  const gone = latestHeight - lastProof;
  const remainingBlocks = getRemainingBlocks(gone, demotionPeriod);

  return demotionPeriod > 0 && remainingBlocks <= 0;
}

export function isPromotable({ lastPromotion, rank, latestHeight, params }) {
  if (isNil(latestHeight)) {
    return false;
  }

  const promotionPeriod = getPromotionPeriod(rank, params);
  const gone = latestHeight - lastPromotion;
  const remainingBlocks = getRemainingBlocks(gone, promotionPeriod);

  return promotionPeriod > 0 && remainingBlocks <= 0;
}
