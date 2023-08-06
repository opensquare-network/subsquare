import getVoteEndInfo from "../vote/utils/getVoteEndInfo";
import BigNumber from "bignumber.js";

export default function calcTotalVotes(
  votes = [],
  priors = [],
  period,
  isReferenda,
) {
  const maxLockByVotes = votes.reduce((result, voteItem) => {
    const itemLock = getVoteEndInfo(voteItem, period, isReferenda);
    const { hasLock, balance } = itemLock;
    if (!hasLock) {
      return result;
    }

    return BigNumber.max(result, balance).toString();
  }, 0);

  const maxPriorLock = Math.max(...priors.map(({ prior }) => prior.balance));

  return BigNumber.max(maxLockByVotes, maxPriorLock).toString();
}
