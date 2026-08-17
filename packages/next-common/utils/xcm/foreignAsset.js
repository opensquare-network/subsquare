// Origin parsing adapted from kheopswap's foreign-asset token description:
// https://github.com/kheopswap/kheopswap/blob/main/web/src/utils/getTokenDescription.ts
import { isNil } from "lodash-es";
import { getEvmNetworkName } from "./evmNetworks";
import { getParachainName } from "./parachains";

const unknownOrigin = "Unknown";

/**
 * Get the origin network name from a PAPI XCM MultiLocation.
 */
export function getForeignAssetOrigin(location, relay) {
  const interior = location?.interior;

  if (interior?.type === "X1") {
    if (interior.value?.type === "Parachain") {
      return getParachainName(relay, interior.value.value);
    }

    if (interior.value?.type === "GlobalConsensus") {
      return interior.value.value?.type || unknownOrigin;
    }
  }

  if (interior?.type === "X2" && Array.isArray(interior.value)) {
    const [firstJunction, secondJunction] = interior.value;

    if (
      firstJunction?.type === "GlobalConsensus" &&
      firstJunction.value?.type === "Ethereum" &&
      secondJunction?.type === "AccountKey20"
    ) {
      const chainId = firstJunction.value.value?.chain_id;
      if (isNil(chainId)) {
        return unknownOrigin;
      }

      return getEvmNetworkName(chainId);
    }

    if (firstJunction?.type === "Parachain") {
      return getParachainName(relay, firstJunction.value);
    }
  }

  return unknownOrigin;
}
