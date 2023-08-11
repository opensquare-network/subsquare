import React, { useState } from "react";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import { useDispatch, useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import getVoteExpiredReferenda from "./getVoteExpiredReferenda";
import useMyClassLocksFor from "./useMyClassLocksFor";
import VoteSummary from "./summary";
import ClearExpiredReferendaVotePopup from "../clearExpiredReferendaVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { totalReferendaLockRequiredSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalLockRequired";

export default function ReferendaSummary({ votes }) {
  const dispatch = useDispatch();
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod("convictionVoting");
  const latestHeight = useSelector(latestHeightSelector);
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);
  const lockRequired = useSelector(totalReferendaLockRequiredSelector);

  const voteExpiredReferenda = getVoteExpiredReferenda(
    votes,
    period,
    isReferenda,
    latestHeight,
  );

  const classLocks = useMyClassLocksFor();
  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  const unLockable = BigNumber(lockFromOnChainData).minus(lockRequired);

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
