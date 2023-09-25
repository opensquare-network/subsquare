import { noLockObj, noResultObj } from "./consts";
import getDemocracyEndInfo from "./democracy/endInfo";
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

function getReferendumEndInfo(referendumInfo, isReferenda) {
  if (isReferenda) {
    return getReferendaEndInfo(referendumInfo);
  } else {
    return getDemocracyEndInfo(referendumInfo);
  }
}

export default function getVoteEndInfo(voteInfo, period, isReferenda) {
  const { vote, referendumInfo } = voteInfo;
  if (!vote.isStandard) {
    return noLockObj;
  }

  const referendumEndInfo = getReferendumEndInfo(referendumInfo, isReferenda);
  if (!referendumEndInfo.hasResult) {
    return noLockObj;
  }

  if (referendumEndInfo.approved !== vote.aye) {
    return noLockObj;
  }

  const lockEnd = calcVoteLockEnd(
    referendumEndInfo.end,
    period,
    vote.conviction,
  );
  return {
    hasLock: true,
    period,
    balance: vote.balance,
    voteEnd: referendumEndInfo.end,
    lockEnd,
  };
}
