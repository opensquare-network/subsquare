import { isNil } from "lodash-es";
import {
  isDemotionAboutToExpire,
  isDemotionExpired,
  isPromotable,
} from "next-common/utils/collective/demotionAndPromotion";

export function filterDemotionAboutToExpireFn(
  members,
  params,
  blockTime,
  latestHeight,
) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

    const {
      rank,
      status: { lastProof },
    } = member;

    return isDemotionAboutToExpire({
      lastProof,
      rank,
      params,
      blockTime,
      latestHeight,
    });
  });
}

export function filterDemotionExpiredFn(members, params, latestHeight) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

    const {
      rank,
      status: { lastProof },
    } = member;

    return isDemotionExpired({
      lastProof,
      rank,
      latestHeight,
      params,
    });
  });
}

export function filterPromotableFn(members, params, latestHeight) {
  return members.filter((member) => {
    if (isNil(member?.status)) return false;

    const {
      rank,
      status: { lastPromotion },
    } = member;

    return isPromotable({
      lastPromotion,
      rank,
      latestHeight,
      params,
    });
  });
}
