import BigNumber from "bignumber.js";

export function getTotalVotesValue(dvVote) {
  let totalVotes = null;

  if (!dvVote) {
    return totalVotes;
  }

  // todo: need more type
  if (dvVote.isStandard) {
    totalVotes = BigNumber(dvVote.votes).plus(dvVote.delegations?.votes || 0);
  } else if (dvVote.isSplitAbstain) {
    totalVotes = BigNumber(dvVote.abstainVotes || 0);
  } else if (dvVote.isSplit) {
    // todo: how to display
    totalVotes = BigNumber(dvVote.ayeVotes || 0);
  }

  return totalVotes;
}
