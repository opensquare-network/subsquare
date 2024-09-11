import { usePostOnChainData } from "../index";
import { useDecisionBlocks } from "@subsquare/next/components/gov2/sidebar/status/useDecisionPercentage";

export function useTrack() {
  const { trackInfo } = usePostOnChainData();
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
export function useConfirm() {
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
