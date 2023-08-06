import getVoteEndInfo from "../vote/utils/getVoteEndInfo";
import BigNumber from "bignumber.js";

export default function calcNotExpired(
  votes = [],
  priors = [],
  period,
  isReferenda,
  latestHeight,
) {
  const maxVotesExpired = votes.reduce((result, voteItem) => {
    const itemLock = getVoteEndInfo(voteItem, period, isReferenda);
    const { hasLock, lockEnd, balance } = itemLock;

    if (hasLock && latestHeight >= lockEnd) {
      return BigNumber.max(result, balance).toString();
    }

    return result;
  }, 0);

  const maxPriorExpired = priors.reduce((result, prior) => {
    const { unlockAt, balance } = prior;
    if (latestHeight >= unlockAt) {
      return BigNumber.max(result, balance).toString();
    }

    return result;
  }, 0);

  return BigNumber.max(maxVotesExpired, maxPriorExpired).toString();
}
