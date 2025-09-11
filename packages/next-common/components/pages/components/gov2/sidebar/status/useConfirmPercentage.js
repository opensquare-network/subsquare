import {
  useConfirming,
  useConfirmingStarted,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import { useConfirmPeriod } from "next-common/context/post/gov2/track";
import { isNil } from "lodash-es";
import { useDecisionBlocks } from "./useDecisionPercentage";
import { useMemo } from "react";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

// get confirm remaining blocks
export function useConfirmRemaining() {
  const latestHeight = useAhmLatestHeight();
  const confirmingAt = useConfirmingStarted();
  const confirmPeriod = useConfirmPeriod();
  if (isNil(latestHeight) || latestHeight <= confirmingAt) {
    return 0;
  }

  const gone = latestHeight - confirmingAt;
  if (gone > confirmPeriod) {
    return 0;
  } else {
    return confirmPeriod - gone;
  }
}

export function useConfirmStartPercentage() {
  const decidingSince = useDecidingSince();
  const confirmingStarted = useConfirmingStarted();
  const period = useDecisionBlocks();
  if (!decidingSince || !confirmingStarted) {
    return 0;
  }

  const percentage = ((confirmingStarted - decidingSince) / period) * 100;
  return Number(percentage).toFixed(2);
}

export function useConfirmEndPercentage() {
  const period = useDecisionBlocks();
  const confirmPeriod = useConfirmPeriod();
  return (confirmPeriod / period) * 100;
}

// TODO: move to calc-related file
export function calcConfirmStartPercentage(
  decidingSince,
  decisionBlocks,
  confirmingStarted,
) {
  if (!decidingSince || !confirmingStarted) {
    return 0;
  }

  return ((confirmingStarted - decidingSince) / decisionBlocks) * 100;
}

export function useConfirmPercentage() {
  const latestHeight = useAhmLatestHeight();

  const confirmPeriod = useConfirmPeriod();
  const confirmStart = useConfirmingStarted();
  const confirmFinishHeight = useConfirming();

  return useMemo(() => {
    if (isNil(latestHeight) || latestHeight <= confirmStart) {
      return 0;
    } else if (latestHeight >= confirmFinishHeight) {
      return 100;
    }

    const gone = latestHeight - confirmStart;
    return Number((gone / confirmPeriod) * 100).toFixed(2);
  }, [latestHeight, confirmStart, confirmPeriod, confirmFinishHeight]);
}
