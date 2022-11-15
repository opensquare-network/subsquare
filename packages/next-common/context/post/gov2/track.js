import { usePostOnChainData } from "../index";
import { estimateBlocksTime } from "../../../utils";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { blockTimeSelector } from "../../../store/reducers/chainSlice";

export function useTrack() {
  const { trackInfo } = usePostOnChainData();
  if (!trackInfo) {
    throw new Error(
      "No track info, make sure track existed before using `useTrack`"
    );
  }

  return trackInfo;
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

export function useDecisionTime() {
  const blockTime = useSelector(blockTimeSelector);
  const decision = useDecision();

  return useMemo(() => {
    const timeArr = estimateBlocksTime(decision, blockTime);
    return timeArr.join(" ");
  }, [decision, blockTime]);
}

export function useConfirmTime() {
  const blockTime = useSelector(blockTimeSelector);
  const confirm = useConfirm();

  return useMemo(() => {
    const timeArr = estimateBlocksTime(confirm, blockTime);
    return timeArr.join(" ");
  }, [confirm, blockTime]);
}
