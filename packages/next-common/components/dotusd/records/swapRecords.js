import { isNil } from "lodash-es";
import { toBigIntOrNull } from "../psmUtils";

export const SWAP_METHOD = Object.freeze({
  mint: "Minted",
  redeem: "Redeemed",
});

/**
 * The swaps come from the chain scan, which serves the args of an event as the list it
 * stores them in, one entry per field:
 * `[{ name: "who", typeName: "AccountId32", value: "1Zbw..." }, ...]`.
 */
export function eventArgsToValues(args) {
  return Object.fromEntries(
    (args ?? []).map(({ name, value }) => [name, value]),
  );
}

/**
 * The swaps of one page of the events api: its `items` holds a row more than the page does while
 * another page is left, which is how the pager knows of one without the api counting the events.
 */
export function swapsPage({ items = [], pageSize }) {
  const hasMore = items.length > pageSize;

  return {
    swaps: hasMore ? items.slice(0, pageSize) : items,
    hasMore,
  };
}

/**
 * The assets of a swap are XCM locations in the form the chain serialises them to, e.g.
 * `{ parents: 0, interior: { x2: [{ palletInstance: 50 }, { generalIndex: 7873 }] } }`.
 * `assetIndexFromLocation` of psmUtils reads the PAPI decoded form of the same location,
 * which is a different shape, so it can not be reused here.
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
 * external asset. Both charge the fee in dotUSD.
 */
export function buildSwapRecord(event) {
  const values = eventArgsToValues(event?.args);
  const isMint = event?.method === SWAP_METHOD.mint;
  const internalAssetIndex = assetIndexFromSerializedLocation(
    values.internal_asset,
  );
  const externalAssetIndex = assetIndexFromSerializedLocation(
    values.external_asset,
  );

  return {
    isMint,
    address: values.who ?? null,
    internalAssetIndex,
    externalAssetIndex,
    paidAssetIndex: isMint ? externalAssetIndex : internalAssetIndex,
    paidAmount: toBigIntOrNull(
      isMint ? values.external_consumed : values.internal_consumed,
    ),
    receivedAssetIndex: isMint ? internalAssetIndex : externalAssetIndex,
    receivedAmount: toBigIntOrNull(
      isMint ? values.internal_received : values.external_received,
    ),
    fee: toBigIntOrNull(values.internal_fee),
    indexer: event?.indexer ?? {},
  };
}
