import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import useMyClassLocksFor from "./useMyClassLocksFor";
import VoteSummary from "./summary";
import ClearExpiredReferendaVotePopup from "../clearExpiredReferendaVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { totalReferendaLockRequiredSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalLockRequired";
import { voteExpiredReferendaSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/voteExpiredReferenda";

export default function ReferendaSummary({ votes }) {
  const dispatch = useDispatch();
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);
  const lockRequired = useSelector(totalReferendaLockRequiredSelector);
  const voteExpiredReferenda = useSelector(voteExpiredReferendaSelector);

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
