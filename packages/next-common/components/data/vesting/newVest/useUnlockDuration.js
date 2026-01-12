import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import BigNumber from "bignumber.js";

export function formatDuration(seconds) {
  const minutes = seconds.div(60).integerValue();
  const hours = minutes.div(60).integerValue();
  const days = hours.div(24).integerValue();

  if (days.gte(1)) {
    return `~${days.toString()} days`;
  } else if (hours.gte(1)) {
    return `~${hours.toString()} hours`;
  } else if (minutes.gte(1)) {
    return `~${minutes.toString()} minutes`;
  } else {
    return `~${seconds.toString()} seconds`;
  }
}

export function calcUnlockDuration(
  lockedAmount,
  perBlock,
  decimals,
  blockTimeSeconds,
) {
  try {
    const bnLocked = checkInputValue(lockedAmount, decimals, "locked");
    const bnPerBlock = checkInputValue(perBlock, decimals, "perBlock");
    if (bnPerBlock.isZero()) {
      return null;
    }
    const blocks = bnLocked.div(bnPerBlock).integerValue(BigNumber.ROUND_CEIL);
    const seconds = blocks.times(blockTimeSeconds);
    return formatDuration(seconds);
  } catch {
    return null;
  }
}

export default function useUnlockDuration(lockedAmount, perBlock) {
  const { decimals, blockTime } = useChainSettings();
  const blockTimeSeconds = (blockTime || 6000) / 1000;

  const unlockDuration = useMemo(() => {
    return calcUnlockDuration(
      lockedAmount,
      perBlock,
      decimals,
      blockTimeSeconds,
    );
  }, [lockedAmount, perBlock, decimals, blockTimeSeconds]);

  return { unlockDuration, blockTimeSeconds };
}
