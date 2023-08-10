import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import VoteSummary from "./summary";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import ClearExpiredDemocracyVotePopup from "../clearExpiredDemocracyVotePopup";
import useBalanceDemocracLock from "./democracy/useBalanceDemocracLock";
import {
  democracyLockFromOnChainDataSelector,
  democracyVotesLengthSelector,
} from "next-common/store/reducers/myOnChainData/democracy/selectors/myVoting";
import { democracyLockRequiredSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/lockRequired";
import democracyVoteExpiredReferendaSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/expiredReferenda";

export default function DemocracySummary() {
  const dispatch = useDispatch();
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChain = useSelector(democracyLockFromOnChainDataSelector);
  const lockRequired = useSelector(democracyLockRequiredSelector);
  const voteExpiredReferenda = useSelector(
    democracyVoteExpiredReferendaSelector,
  );
  const votesCount = useSelector(democracyVotesLengthSelector);

  // This value indicate the total balance locked by democracy vote
  const democracLockBalance = useBalanceDemocracLock();
  const totalLocked = BigNumber.max(
    lockFromOnChain,
    democracLockBalance,
  ).toString();
  const unLockable = BigNumber(democracLockBalance).minus(lockRequired);

  return (
    <>
      <VoteSummary
        votesLength={votesCount}
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
