import { useTrack } from "next-common/context/post/gov2/track";
import { useDecidingSince } from "next-common/context/post/gov2/referendum";
import { useOnchainData } from "next-common/context/post";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";

export function usePreparingBlocks() {
  const track = useTrack();
  const decidingBlockHeight = useDecidingSince();
  const onchainData = useOnchainData();
  const createBlockHeight = onchainData.indexer.blockHeight;
  const preparePeriod = track.preparePeriod;

  if (
    decidingBlockHeight &&
    preparePeriod > decidingBlockHeight - createBlockHeight
  ) {
    return decidingBlockHeight - createBlockHeight;
  }

  return preparePeriod;
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
