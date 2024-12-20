import getDemocracyEndInfo from "../vote/utils/democracy/endInfo";
import { noLockObj } from "../vote/utils/consts";
import calcVoteLockEnd from "../utils/calcVoteLockEnd";

export default function calcDemocracyDelegateVoteLock(
  referendumInfo,
  lockPeriod,
  delegateVote,
  targetVote,
) {
  if (!targetVote || !referendumInfo) {
    throw new Error(
      "No referendumInfo or targetVote provide to calculate democracy vote lock info",
    );
  }

  const referendumEndInfo = getDemocracyEndInfo(referendumInfo);
  if (!referendumEndInfo.hasResult || !targetVote.isStandard) {
    return noLockObj;
  }

  if (referendumEndInfo.approved !== targetVote.aye) {
    return noLockObj;
  }

  const lockEnd = calcVoteLockEnd(
    referendumEndInfo.end,
    lockPeriod,
    delegateVote.conviction,
  );
  return {
    hasLock: true,
    period: lockPeriod,
    balance: delegateVote.balance,
    voteEnd: referendumEndInfo.end,
    lockEnd,
  };
}
