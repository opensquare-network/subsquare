import React from "react";
import { useIsReferenda } from "next-common/components/profile/votingHistory/common";
import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import calcTotalVotes from "./calcTotalVotes";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import calcNotExpired from "./calcNotExpired";
import BigNumber from "bignumber.js";
import getVoteExpiredReferenda from "./getVoteExpiredReferenda";
import useMyClassLocksFor from "./useMyClassLocksFor";
import VoteSummary from "./summary";

export default function Summary({ votes, priors = [] }) {
  const isReferenda = useIsReferenda();
  const period = useVoteLockingPeriod(
    isReferenda ? "convictionVoting" : "democracy",
  );
  const latestHeight = useSelector(latestHeightSelector);

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
  console.log("voteExpiredReferenda", voteExpiredReferenda);

  const classLocks = useMyClassLocksFor();
  console.log("classLocks", classLocks);

  // fixme: we may divide this component into 2 for OpenGov and democracy
  return (
    <VoteSummary
      votesLength={votes?.length}
      totalLocked={totalLockedBalance}
      unLockable={totalExpired}
    />
  );
}
