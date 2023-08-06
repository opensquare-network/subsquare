import { noLockObj, noResultObj } from "./consts";

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

function getDemocracyEndInfo(referendumInfo) {
  if (!referendumInfo.finished) {
    return noResultObj;
  }

  return {
    hasResult: true,
    approved: referendumInfo.approved,
    end: referendumInfo.end,
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

  const standard = vote.asStandard;
  const aye = standard.vote.isAye;
  if (referendumEndInfo.approved !== aye) {
    return noLockObj;
  }

  const conviction = standard.vote.conviction.toNumber();
  const lockEnd = referendumEndInfo.end + conviction * period;
  return {
    hasLock: true,
    period,
    balance: standard.balance.toString(),
    voteEnd: referendumEndInfo.end,
    lockEnd,
  };
}
