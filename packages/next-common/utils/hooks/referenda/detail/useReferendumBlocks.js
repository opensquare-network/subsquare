import { useTrack } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useOnchainData } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useUndecidingTimeout from "next-common/hooks/referendaPallet/useUndecidingTimeout";

export function usePreparingBlocks(isFellowship = false) {
  const track = useTrack();
  const decidingSince = useDecidingSince();
  const voteFinishedHeight = useReferendumVotingFinishHeight();
  const onchainData = useOnchainData();
  const referendumStartHeight = onchainData.indexer.blockHeight;
  const preparePeriod = track.preparePeriod;
  const timeout = useUndecidingTimeout(
    isFellowship ? "fellowshipReferenda" : "referenda",
  );

  // it means a referendum has deciding phase
  if (decidingSince) {
    return preparePeriod;
  }

  // no deciding phase, then it maybe TimedOut/Cancelled/Killed
  if (voteFinishedHeight) {
    return voteFinishedHeight - referendumStartHeight;
  } else {
    return Math.max(preparePeriod, timeout ?? 0);
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
