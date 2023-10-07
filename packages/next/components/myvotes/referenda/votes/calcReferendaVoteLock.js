import { noLockObj, noResultObj } from "../../vote/utils/consts";
import calcVoteLockEnd from "../../utils/calcVoteLockEnd";

function getReferendaEndInfo(referendumInfo) {
  const { rejected, approved } = referendumInfo;
  if (!rejected && !approved) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: !!approved,
    end: (approved || rejected)[0],
  };
}

export default function calcReferendaVoteLock(
  vote,
  referendumInfo,
  lockPeriod,
) {
  const { isStandard, conviction } = vote || {};
  if (!isStandard) {
    return noLockObj;
  }

  const referendumEndInfo = getReferendaEndInfo(referendumInfo);
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
