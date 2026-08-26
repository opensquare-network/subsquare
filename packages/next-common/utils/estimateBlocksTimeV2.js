import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { formatTimeDuration } from "./viewfuncs/formatTimeDuration";

function normalizeBlockTimeHistory(blockTimeHistory, fallbackBlockTime) {
  const valid = (
    Array.isArray(blockTimeHistory) ? blockTimeHistory : []
  ).filter(
    (e) => e && typeof e.height === "number" && Number(e.blockTimeMs) > 0,
  );
  if (valid.length > 0) {
    return [...valid].sort((a, b) => a.height - b.height);
  }

  const fallback = Number(fallbackBlockTime);
  if (fallback > 0) {
    return [{ height: 0, blockTimeMs: fallback }];
  }

  return null;
}

/**
 * Normalize a chain's block-time history into sorted eras
 * [{ height, blockTimeMs }], where `height` is the block height at which
 * `blockTimeMs` starts to apply. Falls back to a single era built from the
 * chain's current `blockTime`, so chains without history data keep working.
 */
export function getBlockTimeHistory(chainSettings) {
  return normalizeBlockTimeHistory(
    chainSettings?.blockTimeHistory,
    chainSettings?.blockTime,
  );
}

/**
 * Milliseconds spanned by [startBlock, endBlock), integrating across the
 * block-time eras described by `blockTimeHistory`. Correct even when the span
 * crosses historical block-time changes (e.g. Hydration 12s -> 6s -> 2s).
 */
export function estimateBlockTimeSpanMs(
  startBlock,
  endBlock,
  blockTimeHistory,
) {
  if (isNil(startBlock) || isNil(endBlock) || endBlock <= startBlock) {
    return 0;
  }

  const eras = normalizeBlockTimeHistory(blockTimeHistory, null);
  if (!eras) {
    return 0;
  }

  let ms = 0;
  for (let i = 0; i < eras.length; i++) {
    const eraFrom = eras[i].height;
    const eraTo =
      i + 1 < eras.length ? eras[i + 1].height : Number.MAX_SAFE_INTEGER;
    const segStart = Math.max(startBlock, eraFrom);
    const segEnd = Math.min(endBlock, eraTo);
    if (segStart < segEnd) {
      ms += (segEnd - segStart) * eras[i].blockTimeMs;
    }
  }

  return ms;
}

/**
 * V2: estimate how long `blocks` blocks represent, aware of historical
 * block-time changes.
 *
 * Everything (current block time and block-time history) is derived from the
 * current chain's settings via `getChainSettings(CHAIN)`, so callers don't pass
 * block time data.
 *
 * @param {object} params
 * @param {number} params.blocks - number of blocks to estimate.
 * @param {number} [params.startBlock] - starting block height; when provided,
 *   the span [startBlock, startBlock + blocks) is integrated across the chain's
 *   historical block-time eras, so results stay correct across block-time
 *   changes (e.g. Hydration 12s -> 6s -> 2s).
 * @param {number} [params.blockTime] - optional override of the chain's current
 *   block time; used for the "from now" estimate and as the era fallback when
 *   the chain has no block-time history configured.
 */
export const estimateBlocksTimeV2 = ({ blocks, startBlock, blockTime }) => {
  const chainSettings = getChainSettings(CHAIN);
  const currentBlockTime = blockTime ?? chainSettings.blockTime;
  const blockTimeHistory =
    getBlockTimeHistory(chainSettings) ||
    (currentBlockTime ? [{ height: 0, blockTimeMs: currentBlockTime }] : null);

  if (typeof startBlock === "number" && !isNil(startBlock)) {
    if (!blockTimeHistory) {
      return null;
    }

    const value = estimateBlockTimeSpanMs(
      startBlock,
      startBlock + blocks,
      blockTimeHistory,
    );
    return formatTimeDuration(value, { withUnitSpace: true });
  }

  if (!currentBlockTime) {
    return null;
  }

  const value = new BigNumber(currentBlockTime).multipliedBy(blocks).toNumber();
  return formatTimeDuration(value, { withUnitSpace: true });
};
