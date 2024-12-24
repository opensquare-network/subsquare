import { noLockObj, noResultObj } from "../../vote/utils/consts";
import calcVoteLockEnd from "../../utils/calcVoteLockEnd";

function getDemocracyEndInfo(referendumInfo) {
  if (!referendumInfo || !referendumInfo.finished) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: referendumInfo.finished.approved,
    end: referendumInfo.finished.end,
  };
}

export default function calcDemocracyVoteLock(
  vote,
  referendumInfo,
  lockPeriod,
) {
  const { isStandard, conviction } = vote || {};
  if (!isStandard) {
    return noLockObj;
  }

  const referendumEndInfo = getDemocracyEndInfo(referendumInfo);
  if (!referendumEndInfo.hasResult) {
    return noLockObj;
  }

  if (referendumEndInfo.approved !== vote.aye) {
    return noLockObj;
  }

  const lockEnd = calcVoteLockEnd(
    referendumEndInfo.end,
    lockPeriod,
    conviction,
  );
  return {
    hasLock: true,
    period: lockPeriod,
    balance: vote.balance,
    voteEnd: referendumEndInfo.end,
    lockEnd,
  };
}
