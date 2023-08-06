import getVoteEndInfo from "../vote/utils/getVoteEndInfo";
import BigNumber from "bignumber.js";

export default function calcTotalVotes(votes = [], period, isReferenda) {
  return votes.reduce((result, voteItem) => {
    const itemLock = getVoteEndInfo(voteItem, period, isReferenda);
    const { hasLock, balance } = itemLock;
    if (!hasLock) {
      return result;
    }

    return BigNumber.max(result, balance).toString();
  }, 0);
}
