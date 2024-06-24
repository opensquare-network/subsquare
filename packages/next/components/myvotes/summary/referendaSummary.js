import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import VoteSummary from "./summary";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { totalReferendaLockRequiredSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalLockRequired";
import { voteExpiredReferendaSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/voteExpiredReferenda";
import unlockTracksSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/unlockTracks";
import referendaVotesLengthSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votesLength";
import myReferendaDelegatedSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/delegated";
import {
  incMyReferendaVotesTrigger,
  isLoadingReferendaSummarySelector,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import dynamicPopup from "next-common/lib/dynamic/popup";

const ClearExpiredReferendaVotePopup = dynamicPopup(() =>
  import("../clearExpiredReferendaVotePopup"),
);

export default function ReferendaSummary() {
  const dispatch = useDispatch();
  const [showClearExpired, setShowClearExpired] = useState(false);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChainData = useSelector(referendaLockFromOnChainDataSelector);
  const maxTracksLock = useSelector(maxTracksLockSelector);
  const lockRequired = useSelector(totalReferendaLockRequiredSelector);
  const voteExpiredReferenda = useSelector(voteExpiredReferendaSelector);
  const tracksToUnlock = useSelector(unlockTracksSelector);
  const votesCount = useSelector(referendaVotesLengthSelector);
  const delegated = useSelector(myReferendaDelegatedSelector);
  const loadingSummary = useSelector(isLoadingReferendaSummarySelector);
  const unlockTracks = useSelector(unlockTracksSelector);

  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  const unLockable = BigNumber(locked).minus(lockRequired).toString();

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
        isLoading={loadingSummary}
        votesLength={votesCount}
        totalLocked={locked}
        delegated={delegated}
        unLockable={unLockable}
        actionComponent={actionComponent}
      />
      {showClearExpired && (
        <ClearExpiredReferendaVotePopup
          votes={voteExpiredReferenda}
          unlockTracks={tracksToUnlock}
          onClose={() => setShowClearExpired(false)}
          onInBlock={() => dispatch(incMyReferendaVotesTrigger())}
        />
      )}
    </>
  );
}
