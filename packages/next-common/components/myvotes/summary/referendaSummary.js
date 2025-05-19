import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import VoteSummary from "./summary";
import { maxTracksLockSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/classLocks";
import { referendaLockFromOnChainDataSelector } from "next-common/store/reducers/myOnChainData/referenda/selectors/totalOnChainLock";
import { useTotalReferendaLockRequired } from "next-common/hooks/myOnChainData/referenda/totalLockRequired";
import { useVoteExpiredReferenda } from "next-common/hooks/myOnChainData/referenda/voteExpiredReferenda";
import { useUnlockTracks } from "next-common/hooks/myOnChainData/referenda/unlockTracks";
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
  const lockRequired = useTotalReferendaLockRequired();
  const voteExpiredReferenda = useVoteExpiredReferenda();
  const tracksToUnlock = useUnlockTracks();
  const votesCount = useSelector(referendaVotesLengthSelector);
  const delegated = useSelector(myReferendaDelegatedSelector);
  const loadingSummary = useSelector(isLoadingReferendaSummarySelector);

  const locked = BigNumber.max(lockFromOnChainData, maxTracksLock);
  const unLockable = BigNumber(locked).minus(lockRequired).toString();

  let actionComponent = null;
  if (voteExpiredReferenda.length > 0 || tracksToUnlock.length > 0) {
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
