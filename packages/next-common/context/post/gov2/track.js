import { usePostOnChainData } from "../index";
import { useDecisionBlocks } from "next-common/components/pages/components/gov2/sidebar/status/useDecisionPercentage";
import useOnChainTrackInfo from "next-common/hooks/referenda/useOnChainTrackInfo";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export function useTrack() {
  const onchainData = usePostOnChainData();
  const ssrTrackInfo = onchainData.trackInfo;
  const trackId = ssrTrackInfo?.id ?? onchainData.track;
  const finishHeight = useReferendumVotingFinishHeight();
  // ongoing referendum: latest on-chain track info; finished referendum:
  // on-chain track info as of the height it ended
  const onChainTrackInfo = useOnChainTrackInfo(
    trackId,
    typeof finishHeight === "number" ? finishHeight : null,
  );
  const trackInfo = onChainTrackInfo || ssrTrackInfo;

  if (!trackInfo) {
    throw new Error(
      "No track info, make sure track existed before using `useTrack`",
    );
  }

  return trackInfo;
}

// return detail page track preparation blocks
export function usePreparation() {
  const track = useTrack();
  return track.preparePeriod;
}

// return detail page track decision blocks
export function useDecision() {
  const track = useTrack();
  return track.decisionPeriod;
}

// return detail page track confirm blocks
export function useConfirmPeriod() {
  const track = useTrack();
  return track.confirmPeriod;
}

export function useIsOverDecision() {
  const allBlocks = useDecisionBlocks();
  const normalCaseBlocks = useDecision(); // track decision period
  return allBlocks > normalCaseBlocks;
}

export function useTrackDecisionPercentage() {
  const allBlocks = useDecisionBlocks();
  const normalCaseBlocks = useDecision(); // track decision period
  if (normalCaseBlocks >= allBlocks) {
    return 1;
  } else {
    return normalCaseBlocks / allBlocks;
  }
}
