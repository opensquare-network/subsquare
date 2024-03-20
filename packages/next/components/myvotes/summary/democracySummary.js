import React, { useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import VoteSummary from "./summary";
import ClearExpiredDemocracyVotePopup from "../clearExpiredDemocracyVotePopup";
import MoonClearExpiredDemocracyVotePopup from "../clearExpiredDemocracyVotePopup/moonPopup";
import useBalanceDemocracLock from "./democracy/useBalanceDemocracLock";
import {
  democracyLockFromOnChainDataSelector,
  democracyVotesLengthSelector,
} from "next-common/store/reducers/myOnChainData/democracy/selectors/myVoting";
import { democracyLockRequiredSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/lockRequired";
import democracyVoteExpiredReferendaSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/expiredReferenda";
import myDemocracyDelegatedSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import myDemocracyPriorLockSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/prior";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";
import Tooltip from "next-common/components/tooltip";
import isHydradx from "next-common/utils/isHydradx";

export default function DemocracySummary() {
  const [showClearExpired, setShowClearExpired] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  const prior = useSelector(myDemocracyPriorLockSelector);

  // Locked balance calculated from on-chain voting data
  const lockFromOnChain = useSelector(democracyLockFromOnChainDataSelector);
  const lockRequired = useSelector(democracyLockRequiredSelector);
  const voteExpiredReferenda = useSelector(
    democracyVoteExpiredReferendaSelector,
  );
  const votesCount = useSelector(democracyVotesLengthSelector);
  const delegated = useSelector(myDemocracyDelegatedSelector);
  const democracyVoting = useSelector(myDemocracyVotingSelector);

  // This value indicate the total balance locked by democracy vote
  const democracLockBalance = useBalanceDemocracLock();
  const totalLocked = BigNumber.max(
    lockFromOnChain,
    democracLockBalance,
  ).toString();
  const unLockable = BigNumber(totalLocked).minus(lockRequired).toString();

  let actionComponent = null;
  if (democracyVoting || voteExpiredReferenda.length > 0) {
    if (isHydradx() && voteExpiredReferenda.length > 10) {
      actionComponent = (
        <Tooltip content="HydraDX supports batch deletion up to 10 votes. Please remove votes one by one first.">
          <div className="cursor-pointer text-textDisabled text-[12px]">
            Clear expired votes
          </div>
        </Tooltip>
      );
    } else {
      actionComponent = (
        <div
          className="cursor-pointer text-theme500 text-[12px]"
          onClick={() => setShowClearExpired(true)}
        >
          {voteExpiredReferenda.length <= 0 ? "Unlock" : "Clear expired votes"}
        </div>
      );
    }
  }

  let Popup = ClearExpiredDemocracyVotePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonClearExpiredDemocracyVotePopup;
  }

  return (
    <>
      <VoteSummary
        votesLength={votesCount}
        totalLocked={totalLocked}
        prior={prior}
        delegated={delegated}
        unLockable={democracyVoting ? unLockable : 0}
        actionComponent={actionComponent}
        isLoading={!democracyVoting}
      />
      {showClearExpired && (
        <Popup
          votes={voteExpiredReferenda}
          onClose={() => setShowClearExpired(false)}
        />
      )}
    </>
  );
}
