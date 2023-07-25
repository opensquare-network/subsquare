import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import {
  useConfirmingStarted,
  useDecidingSince,
  userConfirmingAborted,
} from "next-common/context/post/gov2/referendum";
import { useConfirm } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";
import { useDecisionBlocks } from "./useDecisionPercentage";
import { useMemo } from "react";

// get confirm remaining blocks
export function useConfirmRemaining() {
  const latestHeight = useSelector(latestHeightSelector);
  const confirmingAt = useConfirmingStarted();
  const confirmPeriod = useConfirm();
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
  const confirmPeriod = useConfirm();
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

  const percentage =
    ((confirmingStarted - decidingSince) / decisionBlocks) * 100;
  return percentage;
}

export function useConfirmPercentage() {
  const latestHeight = useSelector(latestHeightSelector);

  const confirmPeriod = useConfirm();
  const confirmStart = useConfirmingStarted();
  const confirmAbortedHeight = userConfirmingAborted();

  const confirmPercentage = useMemo(() => {
    if (
      isNil(latestHeight) ||
      latestHeight <= confirmStart ||
      (!isNil(confirmAbortedHeight) && confirmAbortedHeight > confirmStart)
    ) {
      return 0;
    }

    const finishHeight = confirmStart + confirmPeriod;
    if (latestHeight >= finishHeight) {
      return 100;
    }

    const gone = latestHeight - confirmStart;
    return Number((gone / confirmPeriod) * 100).toFixed(2);
  }, [latestHeight, confirmAbortedHeight, confirmStart, confirmPeriod]);

  return confirmPercentage;
}
