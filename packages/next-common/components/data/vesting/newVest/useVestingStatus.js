import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { checkInputValue } from "next-common/utils";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import BigNumber from "bignumber.js";
import { formatDuration } from "./useUnlockDuration";

export const VestingStatus = {
  NOT_STARTED: "not_started",
  PARTIAL: "partial",
  FULLY_UNLOCKED: "fully_unlocked",
};

export default function useVestingStatus(
  lockedAmount,
  perBlock,
  startingBlock,
) {
  const { decimals, blockTime } = useChainSettings();
  const blockTimeSeconds = (blockTime || 6000) / 1000;
  const currentHeight = useAhmLatestHeight();

  return useMemo(() => {
    if (!lockedAmount || !perBlock || !startingBlock || !currentHeight) {
      return null;
    }

    try {
      const bnLocked = checkInputValue(lockedAmount, decimals, "locked");
      const bnPerBlock = checkInputValue(perBlock, decimals, "perBlock");
      const startBlock = parseInt(startingBlock);

      if (bnPerBlock.isZero()) {
        return null;
      }

      const elapsedBlocks = currentHeight - startBlock;

      if (elapsedBlocks <= 0) {
        // Not started yet - remaining duration is full duration
        const totalBlocks = bnLocked
          .div(bnPerBlock)
          .integerValue(BigNumber.ROUND_CEIL);
        const totalSeconds = totalBlocks.times(blockTimeSeconds);
        return {
          available: new BigNumber(0),
          locked: bnLocked,
          status: VestingStatus.NOT_STARTED,
          remainingDuration: formatDuration(totalSeconds),
        };
      }

      const unlocked = bnPerBlock.times(elapsedBlocks);
      if (unlocked.gte(bnLocked)) {
        // Fully unlocked
        return {
          available: bnLocked,
          locked: new BigNumber(0),
          status: VestingStatus.FULLY_UNLOCKED,
          remainingDuration: null,
        };
      }

      // Partially unlocked - calculate remaining duration
      const remainingLocked = bnLocked.minus(unlocked);
      const remainingBlocks = remainingLocked
        .div(bnPerBlock)
        .integerValue(BigNumber.ROUND_CEIL);
      const remainingSeconds = remainingBlocks.times(blockTimeSeconds);

      return {
        available: unlocked,
        locked: remainingLocked,
        status: VestingStatus.PARTIAL,
        remainingDuration: formatDuration(remainingSeconds),
      };
    } catch {
      return null;
    }
  }, [
    lockedAmount,
    perBlock,
    startingBlock,
    currentHeight,
    decimals,
    blockTimeSeconds,
  ]);
}
