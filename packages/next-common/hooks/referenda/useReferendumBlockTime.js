import { useMemo } from "react";
import { useChainSettings } from "next-common/context/chain";
import { getBlockTimeHistory } from "next-common/utils/estimateBlocksTimeV2";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

function getBlockTimeAtBlock(height, eras, fallback) {
  if (typeof height !== "number" || !Array.isArray(eras) || eras.length === 0) {
    return fallback;
  }

  let blockTime = fallback;
  for (const era of eras) {
    if (height >= era.height) {
      blockTime = era.blockTimeMs;
    }
  }
  return blockTime;
}

/**
 * Return the block time (ms) that applies to the current referendum.
 *
 * - Ongoing referendum: use the current (newest) block time. Runtime upgrades
 *   that change the block time (e.g. Hydration v440, 6s -> 2s) also recalibrate
 *   the blocks of still-ongoing referenda (periods ×3), so they are consistent
 *   with the current era and must be converted with the current block time.
 * - Finished referendum: use the block time of the era in which it ended, since
 *   its blocks were produced under that era (e.g. 6s for referenda that ended
 *   before the v440 switch).
 */
export default function useReferendumBlockTime() {
  const chainSettings = useChainSettings();
  const eras = useMemo(
    () => getBlockTimeHistory(chainSettings),
    [chainSettings],
  );
  const currentBlockTime = chainSettings.blockTime;

  const votingFinishHeight = useReferendumVotingFinishHeight();

  return useMemo(() => {
    if (typeof votingFinishHeight !== "number") {
      return currentBlockTime;
    }

    return getBlockTimeAtBlock(votingFinishHeight, eras, currentBlockTime);
  }, [votingFinishHeight, eras, currentBlockTime]);
}
