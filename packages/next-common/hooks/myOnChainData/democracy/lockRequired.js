import { useSelector } from "react-redux";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import getOnChainVoteLock from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/getOngoingVoteLock";
import BigNumber from "bignumber.js";
import { democracyLockingPeriodSelector } from "next-common/store/reducers/democracy/info";
import getFinishedVoteLock from "next-common/store/reducers/myOnChainData/democracy/selectors/utils/getFinishedVoteLock";
import useChainOrScanHeight from "next-common/hooks/height";

export function useDemocracyLockRequired() {
  const voting = useSelector(myDemocracyVotingSelector);
  const latestHeight = useChainOrScanHeight();
  const lockingPeriod = useSelector(democracyLockingPeriodSelector);

  if (!voting) {
    return 0;
  }

  const { prior, votes = [], isDelegating, balance } = voting;

  const delegatingRequired = isDelegating ? balance : 0;

  const { unlockAt, balance: priorBalance } = prior;
  const priorRequired = latestHeight < unlockAt ? priorBalance : 0;

  const votesLockRequired = votes.reduce((result, voteItem) => {
    const { vote, referendumInfo } = voteItem;
    if (referendumInfo?.ongoing) {
      const voteLock = getOnChainVoteLock(vote);
      return BigNumber.max(result, voteLock).toString();
    } else if (referendumInfo && referendumInfo.finished) {
      const voteLockRequired = getFinishedVoteLock(
        vote,
        referendumInfo,
        latestHeight,
        lockingPeriod,
      );
      return BigNumber.max(result, voteLockRequired).toString();
    } else {
      return result;
    }
  }, 0);

  return BigNumber.max(
    priorRequired,
    votesLockRequired,
    delegatingRequired,
  ).toString();
}
