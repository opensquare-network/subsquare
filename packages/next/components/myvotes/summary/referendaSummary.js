import React, { useState } from "react";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import calcTotalVotes from "./calcTotalVotes";
import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import calcNotExpired from "./calcNotExpired";
import BigNumber from "bignumber.js";
import getVoteExpiredReferenda from "./getVoteExpiredReferenda";
import useMyClassLocksFor from "./useMyClassLocksFor";
import VoteSummary from "./summary";
import ClearExpiredReferendaVotePopup from "../clearExpiredReferendaVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";

export default function ReferendaSummary({ votes, priors = [] }) {
  const dispatch = useDispatch();
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod("convictionVoting");
  const latestHeight = useSelector(latestHeightSelector);
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);

  const totalLockedBalance = calcTotalVotes(votes, priors, period, isReferenda);
  const totalNotExpired = calcNotExpired(
    votes,
    priors,
    period,
    isReferenda,
    latestHeight,
  );
  const totalExpired = new BigNumber(totalLockedBalance)
    .minus(totalNotExpired)
    .toString();

  const voteExpiredReferenda = getVoteExpiredReferenda(
    votes,
    period,
    isReferenda,
    latestHeight,
  );

  const classLocks = useMyClassLocksFor();
  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  const unLockableByClassLocks = BigNumber.min(
    ...(classLocks || []).map((lock) => lock.unLockable),
    0,
  ).toString();
  const unLockable = BigNumber.max(totalExpired, unLockableByClassLocks);

  return (
    <>
      <VoteSummary
        votesLength={votes?.length}
        totalLocked={locked}
        unLockable={unLockable}
        setShowClearExpired={setShowClearExpired}
        actionTitle={voteExpiredReferenda.length <= 0 ? "Unlock" : null}
      />
      {showClearExpired && (
        <ClearExpiredReferendaVotePopup
          votes={voteExpiredReferenda}
          classLocks={classLocks}
          onClose={() => setShowClearExpired(false)}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
