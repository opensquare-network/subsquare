import { isNil } from "lodash-es";

// The dotUSD PSM instance is identified by its internal asset, asset 7873 on Asset Hub Polkadot.
export const DOT_USD_ASSET_ID = 7873;

/**
 * The assets of the dotUSD PSM, as Asset Hub names them: the internal dotUSD and the external
 * assets the instance has been approved for. A swap only carries the asset id, so the page
 * resolves the symbol and decimals here rather than asking the chain or another api for them.
 * A swap of an asset missing from this map is shown in raw units, tagged with its id.
 */
export const PSM_ASSET_METAS = Object.freeze({
  [DOT_USD_ASSET_ID]: Object.freeze({ symbol: "dotUSD", decimals: 6 }),
  1984: Object.freeze({ symbol: "USDt", decimals: 6 }),
  1337: Object.freeze({ symbol: "USDC", decimals: 6 }),
});

export function getAssetMeta(index) {
  if (isNil(index)) {
    return null;
  }

  return PSM_ASSET_METAS[index] ?? null;
}
