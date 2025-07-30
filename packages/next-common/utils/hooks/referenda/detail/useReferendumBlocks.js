import { useTrack } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useOnchainData } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useChainOrScanHeight from "next-common/hooks/height";
import { useMemo } from "react";

export function usePreparingBlocks() {
  const track = useTrack();
  const decidingSince = useDecidingSince();
  const voteFinishedHeight = useReferendumVotingFinishHeight();
  const onchainData = useOnchainData();
  const referendumStartHeight = onchainData.indexer.blockHeight;
  const preparePeriod = track.preparePeriod;
  const latestHeight = useChainOrScanHeight();

  // it means a referendum has deciding phase
  if (decidingSince) {
    return Math.max(preparePeriod, decidingSince - referendumStartHeight);
  }

  // no deciding phase, then it maybe TimedOut/Cancelled/Killed
  if (voteFinishedHeight) {
    return voteFinishedHeight - referendumStartHeight;
  } else {
    return Math.max(preparePeriod, latestHeight - referendumStartHeight);
  }
}

export function useDecisionBlocks() {
  const track = useTrack();
  const decidingSince = useDecidingSince();
  const finishedHeight = useReferendumVotingFinishHeight();

  if (finishedHeight && finishedHeight > decidingSince + track.decisionPeriod) {
    return finishedHeight - decidingSince;
  }

  return track.decisionPeriod;
}

const oneHour = 3600 * 1000;

export function useBlockSteps() {
  const blockTime = useSelector(blockTimeSelector);
  return oneHour / blockTime; // it means the blocks between 2 dots.
}

export function usePreparingHours() {
  const preparingBlocks = usePreparingBlocks();
  const blockStep = useBlockSteps();
  return useMemo(
    () => Math.floor(preparingBlocks / blockStep),
    [blockStep, preparingBlocks],
  );
}

export function useDecisionHours() {
  const blockStep = useBlockSteps();
  const decisionBlocks = useDecisionBlocks();
  return useMemo(
    () => Math.floor(decisionBlocks / blockStep),
    [blockStep, decisionBlocks],
  );
}

export function useDecisionIndex() {
  const hours = usePreparingHours();
  if (hours) {
    return hours - 1;
  }
  return 0;
}

export function useBeginHeight() {
  const preparingHours = usePreparingHours();
  const onchainData = useOnchainData();
  const decidingSince = useDecidingSince();

  if (preparingHours) {
    return onchainData.indexer.blockHeight;
  }
  return decidingSince;
}
