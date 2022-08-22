import BigNumber from "bignumber.js";
import compareRationals from "next-common/utils/democracy/rational";

const ONE = new BigNumber(1);

export function getThresholdOfSimplyMajority() {
  return "50%";
}

export function getThresholdOfSuperMajorityAgainst(turnout, totalIssuance) {
  const sqrtElectorate = BigNumber.max(totalIssuance, turnout).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtOfTurnout).div(sqrtElectorate);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}

export function getThresholdOfSuperMajorityApprove(turnout, totalIssuance) {
  const sqrtElectorate = BigNumber.max(totalIssuance, turnout).sqrt();
  const sqrtOfTurnout = new BigNumber(turnout).sqrt();

  if (sqrtOfTurnout.isZero() || sqrtElectorate.isZero()) {
    return "0%";
  }

  const bnAyes = ONE.times(sqrtElectorate).div(sqrtOfTurnout);
  const threshold = bnAyes.div(bnAyes.plus(ONE)).times(100).toFixed(0);

  return `${threshold}%`;
}

export function calcPassing(referendumInfo, totalIssuance) {
  if (!referendumInfo) {
    return false;
  }

  const ayes = new BigNumber(referendumInfo.tally.ayes);
  const nays = new BigNumber(referendumInfo.tally.nays);
  const threshold = referendumInfo.threshold;

  if (threshold.toLowerCase() === "simplemajority") {
    return ayes.gt(nays);
  }

  const turnout = new BigNumber(referendumInfo.tally.turnout);
  const sqrtTurnout = turnout.sqrt();
  const sqrtElectorate = BigNumber.max(totalIssuance, turnout).sqrt();

  if (sqrtTurnout.isZero() || sqrtElectorate.isZero()) {
    return false;
  }

  if (threshold.toLowerCase() === "supermajorityapprove") {
    return compareRationals(nays, sqrtTurnout, ayes, sqrtElectorate);
  } else if (threshold.toLowerCase() === "supermajorityagainst") {
    return compareRationals(nays, sqrtElectorate, ayes, sqrtTurnout);
  }

  return false;
}

export async function getAddressVote(api, referendumIndex, address) {
  const voting = await api.query.democracy.votingOf(address);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }
  return (jsonVoting.votes || []).find(
    (vote) => vote[0] === referendumIndex
  )?.[1];
}
