import { isNil } from "lodash-es";
import { getBlockApiByHeight } from "next-common/services/chain/api";

/**
 * Get the relay chain block number of a governance chain block.
 *
 * Since the asset hub migration referenda live on the asset hub, so the height
 * from the timeline is an asset hub height. `parachainSystem` is the only way
 * to map it back to a relay chain height, which is necessary whenever the relay
 * chain state at that time has to be queried.
 *
 * @param {import("@polkadot/api").ApiPromise} api governance chain api
 * @param {number} [blockHeight] governance chain block height, latest if omitted
 * @returns {Promise<number|undefined>}
 */
export async function getRelayChainBlockNumber(api, blockHeight) {
  if (!api) {
    return null;
  }

  const apiAt = isNil(blockHeight)
    ? api
    : await getBlockApiByHeight(api, blockHeight);
  const relayChainBlockNumber =
    await apiAt?.query?.parachainSystem?.lastRelayChainBlockNumber?.();

  return relayChainBlockNumber?.toNumber();
}
