import { isNil } from "lodash-es";
import { toBigIntOrNull } from "../psmUtils";

export const SWAP_METHOD = Object.freeze({
  mint: "Minted",
  redeem: "Redeemed",
});

/**
 * The assets of a swap are XCM locations in the form the chain serialises them to, e.g.
 * `{ parents: 0, interior: { x2: [{ palletInstance: 50 }, { generalIndex: 7873 }] } }`, which
 * is how the block scan stores them. `assetIndexFromLocation` of psmUtils reads the PAPI
 * decoded form of the same location, which is a different shape, so it can not be reused here.
 */
export function assetIndexFromSerializedLocation(location) {
  const junctions = location?.interior?.x2 ?? [];
  const junction = junctions.find((item) => !isNil(item?.generalIndex));

  if (!junction) {
    return null;
  }

  return Number(junction.generalIndex);
}

/**
 * A mint pays the external asset and receives dotUSD; a redeem pays dotUSD and receives the
 * external asset. Both charge the fee in dotUSD. The swap is one doc of the psmEvent
 * collection the block scan writes, which the backend api serves as it is. The amounts are
 * strings, so a u128 balance keeps every digit of it.
 */
export function buildSwapRecord(swap) {
  const isMint = swap?.method === SWAP_METHOD.mint;
  const internalAssetIndex = assetIndexFromSerializedLocation(
    swap?.internalAsset,
  );
  const externalAssetIndex = assetIndexFromSerializedLocation(
    swap?.externalAsset,
  );

  return {
    isMint,
    address: swap?.who ?? null,
    internalAssetIndex,
    externalAssetIndex,
    paidAssetIndex: isMint ? externalAssetIndex : internalAssetIndex,
    paidAmount: toBigIntOrNull(
      isMint ? swap?.externalConsumed : swap?.internalConsumed,
    ),
    receivedAssetIndex: isMint ? internalAssetIndex : externalAssetIndex,
    receivedAmount: toBigIntOrNull(
      isMint ? swap?.internalReceived : swap?.externalReceived,
    ),
    fee: toBigIntOrNull(swap?.internalFee),
    indexer: swap?.indexer ?? {},
  };
}
