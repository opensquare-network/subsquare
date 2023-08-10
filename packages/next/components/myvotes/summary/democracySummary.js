import React, { useState } from "react";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import calcTotalVotes from "./calcTotalVotes";
import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import calcNotExpired from "./calcNotExpired";
import BigNumber from "bignumber.js";
import getVoteExpiredReferenda from "./getVoteExpiredReferenda";
import VoteSummary from "./summary";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import ClearExpiredDemocracyVotePopup from "../clearExpiredDemocracyVotePopup";
import useBalanceDemocracLock from "./democracy/useBalanceDemocracLock";
import calcDemocracyVotingLocked from "./democracy/calcVotingLocked";
import { myDemocracyDelegationLockSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/myVoting";

export default function DemocracySummary({ votes, priors = [] }) {
  const dispatch = useDispatch();
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod("democracy");
  const latestHeight = useSelector(latestHeightSelector);
  const [showClearExpired, setShowClearExpired] = useState(false);
  const delegationLock = useSelector(myDemocracyDelegationLockSelector);

  const totalVoteEndLockedBalance = calcTotalVotes(
    votes,
    priors,
    period,
    isReferenda,
  );
  const totalVotingLocked = calcDemocracyVotingLocked(votes);
  // This value indicate all un-expired balance by the votes to the vote ended referenda.
  const totalVoteEndNotExpired = calcNotExpired(
    votes,
    priors,
    period,
    isReferenda,
    latestHeight,
  );
  // todo: we should also take delegation locked balance into account.
  const totalLockedWhichCantBeUnlock = BigNumber.max(
    totalVotingLocked,
    totalVoteEndNotExpired,
    delegationLock,
  ).toString();

  const voteExpiredReferenda = getVoteExpiredReferenda(
    votes,
    period,
    isReferenda,
    latestHeight,
  );

  // This value indicate the total balance locked by democracy vote
  const democracLockBalance = useBalanceDemocracLock();

  const totalLocked = BigNumber.max(
    totalVoteEndLockedBalance,
    totalVotingLocked,
    democracLockBalance,
  ).toString();
  const unLockable = BigNumber(democracLockBalance).minus(
    totalLockedWhichCantBeUnlock,
  );

  return (
    <>
      <VoteSummary
        votesLength={votes?.length}
        totalLocked={totalLocked}
        unLockable={unLockable}
        setShowClearExpired={setShowClearExpired}
        actionTitle={voteExpiredReferenda.length <= 0 ? "Unlock" : null}
      />
      {showClearExpired && (
        <ClearExpiredDemocracyVotePopup
          votes={voteExpiredReferenda}
          onClose={() => setShowClearExpired(false)}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
