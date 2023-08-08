import React, { useState } from "react";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import calcTotalVotes from "./calcTotalVotes";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import calcNotExpired from "./calcNotExpired";
import BigNumber from "bignumber.js";
import getVoteExpiredReferenda from "./getVoteExpiredReferenda";
import VoteSummary from "./summary";
import { incMyVotesTrigger } from "next-common/store/reducers/myVotesSlice";
import { useDispatch } from "react-redux";
import ClearExpiredDemocracyVotePopup from "../clearExpiredDemocracyVotePopup";

export default function DemocracySummary({ votes, priors = [] }) {
  const dispatch = useDispatch();
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod("democracy");
  const latestHeight = useSelector(latestHeightSelector);
  const [showClearExpired, setShowClearExpired] = useState(false);

  const totalLockedBalance = calcTotalVotes(votes, priors, period, isReferenda);
  const totalNotExpired = calcNotExpired(
    votes,
    priors,
    period,
    isReferenda,
    latestHeight,
  );
  const totalExpired = new BigNumber(totalLockedBalance).minus(totalNotExpired);

  const voteExpiredReferenda = getVoteExpiredReferenda(
    votes,
    period,
    isReferenda,
    latestHeight,
  );

  return (
    <>
      <VoteSummary
        votesLength={votes?.length}
        totalLocked={totalLockedBalance}
        unLockable={totalExpired}
        setShowClearExpired={setShowClearExpired}
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
