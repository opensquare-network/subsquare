import getVoteEndInfo from "../vote/utils/getVoteEndInfo";
import BigNumber from "bignumber.js";

export default function calcNotExpired(
  votes = [],
  period,
  isReferenda,
  latestHeight,
) {
  return votes.reduce((result, voteItem) => {
    const itemLock = getVoteEndInfo(voteItem, period, isReferenda);
    const { hasLock, lockEnd, balance } = itemLock;

    if (hasLock && latestHeight >= lockEnd) {
      return BigNumber.max(result, balance).toString();
    }

    return result;
  }, 0);
}
