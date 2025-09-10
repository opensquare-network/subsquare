import BigNumber from "bignumber.js";

export function getTotalVotesValue(dvVote) {
  let totalVotes = null;

  if (!dvVote) {
    return totalVotes;
  }

  // todo: need more type
  if (dvVote.isStandard) {
    totalVotes = BigNumber(dvVote.votes).plus(
      dvVote.delegations?.votes["$numberDecimal"] || 0,
    );
  } else if (dvVote.isSplitAbstain) {
    totalVotes = BigNumber(dvVote.abstainVotes["$numberDecimal"] || 0);
  } else if (dvVote.isSplit) {
    // todo: how to display
    totalVotes = BigNumber(dvVote.ayeVotes["$numberDecimal"] || 0);
  }

  return totalVotes;
}
