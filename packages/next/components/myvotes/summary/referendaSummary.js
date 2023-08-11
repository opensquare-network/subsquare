import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import VoteSummary from "./summary";
import ClearExpiredReferendaVotePopup from "../clearExpiredReferendaVotePopup";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { totalReferendaLockRequiredSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalLockRequired";
import { voteExpiredReferendaSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/voteExpiredReferenda";
import unlockTracksSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/unlockTracks";
import unlockTracks from "next-common/store/reducers/myOnChainData/referenda/selectors/unlockTracks";

export default function ReferendaSummary({ votes }) {
  const dispatch = useDispatch();
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);
  const lockRequired = useSelector(totalReferendaLockRequiredSelector);
  const voteExpiredReferenda = useSelector(voteExpiredReferendaSelector);
  const tracksToUnlock = useSelector(unlockTracksSelector);

  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  const unLockable = BigNumber(lockFromOnChainData)
    .minus(lockRequired)
    .toString();

  let actionComponent = null;
  if (voteExpiredReferenda.length > 0 || unlockTracks.length > 0) {
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
        votesLength={votes?.length}
        totalLocked={locked}
        unLockable={unLockable}
        actionComponent={actionComponent}
      />
      {showClearExpired && (
        <ClearExpiredReferendaVotePopup
          votes={voteExpiredReferenda}
          unlockTracks={tracksToUnlock}
          onClose={() => setShowClearExpired(false)}
          onInBlock={() => dispatch(incMyVotesTrigger())}
        />
      )}
    </>
  );
}
