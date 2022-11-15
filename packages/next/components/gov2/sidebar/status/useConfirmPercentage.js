import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import {
  useConfirmingStarted,
  useDecidingSince,
} from "next-common/context/post/gov2/referendum";
import { useConfirm } from "next-common/context/post/gov2/track";
import isNil from "lodash.isnil";
import { useDecisionBlocks } from "./useDecisionPercentage";

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

export function useConfirmOffsetLeftPercentage() {
  const decidingSince = useDecidingSince();
  const confirmingStarted = useConfirmingStarted();
  const period = useDecisionBlocks();
  if (!decidingSince || !confirmingStarted) {
    return 0;
  }

  const percentage = ((confirmingStarted - decidingSince) / period) * 100;
  return Number(percentage).toFixed(2);
}

export function useConfirmOffsetRightPercentage() {
  const offsetLeft = useConfirmOffsetLeftPercentage();
  const period = useDecisionBlocks();
  const confirmPeriod = useConfirm();
  const confirmPercentage = (confirmPeriod / period) * 100;

  const percentage = 100 - offsetLeft - confirmPercentage;
  return Number(percentage).toFixed(2);
}
