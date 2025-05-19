import getOnChainVoteLock from "./getOnChainVoteLock";
import getFinishedVoteLock from "./getFinishedVoteLock";
import BigNumber from "bignumber.js";

// calculate lock required on each track
export default function getTrackRequiredLock(
  voting,
  latestHeight,
  lockingPeriod,
) {
  const { isDelegating, balance, votes = [], prior } = voting;

  const delegatingRequired = isDelegating ? balance : 0;

  const { unlockAt, balance: priorBalance } = prior;
  const priorRequired = latestHeight < unlockAt ? priorBalance : 0;

  const votesLockRequired = votes.reduce((result, voteItem) => {
    const { vote, referendumInfo } = voteItem;
    if (!referendumInfo) {
      return result;
    } else if (referendumInfo.ongoing) {
      const voteLock = getOnChainVoteLock(vote);
      return BigNumber.max(result, voteLock).toString();
    } else {
      const voteLock = getFinishedVoteLock(
        vote,
        referendumInfo,
        latestHeight,
        lockingPeriod,
      );
      return BigNumber.max(result, voteLock).toString();
    }
  }, 0);

  return BigNumber.max(
    priorRequired,
    votesLockRequired,
    delegatingRequired,
  ).toString();
}
