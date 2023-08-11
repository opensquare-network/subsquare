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
import myDemocracyDelegatedSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";

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
  const delegated = useSelector(myDemocracyDelegatedSelector);

  // This value indicate the total balance locked by democracy vote
  const democracLockBalance = useBalanceDemocracLock();
  const totalLocked = BigNumber.max(
    lockFromOnChain,
    democracLockBalance,
  ).toString();
  const unLockable = BigNumber(democracLockBalance)
    .minus(lockRequired)
    .toString();

  let actionComponent = null;
  if (new BigNumber(unLockable).gt(0)) {
    actionComponent = (
      <div
        className="cursor-pointer text-theme500 text-[12px]"
        onClick={() => setShowClearExpired(true)}
      >
        {voteExpiredReferenda.length <= 0 ? "Unlock" : "Clear expired votes"}
      </div>
    );
  }

  return (
    <>
      <VoteSummary
        votesLength={votesCount}
        totalLocked={totalLocked}
        delegated={delegated}
        unLockable={unLockable}
        actionComponent={actionComponent}
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
