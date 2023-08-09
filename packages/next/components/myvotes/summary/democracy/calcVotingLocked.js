import BigNumber from "bignumber.js";

export default function calcDemocracyVotingLocked(votes = []) {
  return votes.reduce((result, voteItem) => {
    const { referendumInfo, vote } = voteItem;
    if (!referendumInfo.ongoing || !vote.isStandard) {
      return result;
    }

    return BigNumber.max(result, vote.asStandard.balance.toString()).toString();
  }, 0);
}
