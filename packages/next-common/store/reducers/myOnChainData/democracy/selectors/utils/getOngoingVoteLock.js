import BigNumber from "bignumber.js";

export default function getOngoingVoteLock(vote) {
  const { isStandard, isSplit } = vote;
  if (isStandard) {
    return vote.balance;
  } else if (isSplit) {
    return new BigNumber(vote.ayeBalance).plus(vote.nayBalance).toString();
  }

  throw new Error("Unknown democracy vote type when calc ongoing vote lock");
}
