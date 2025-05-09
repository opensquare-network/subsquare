import BigNumber from "bignumber.js";

export default function getOnChainVoteLock(vote) {
  const { isStandard, isSplit, isSplitAbstain } = vote;
  if (isStandard) {
    return vote.balance;
  } else if (isSplit) {
    return new BigNumber(vote.ayeBalance).plus(vote.nayBalance).toString();
  } else if (isSplitAbstain) {
    return new BigNumber(vote.ayeBalance)
      .plus(vote.nayBalance)
      .plus(vote.abstainBalance)
      .toString();
  }

  throw new Error("Unknown referenda vote type when calc on-chain vote lock");
}
