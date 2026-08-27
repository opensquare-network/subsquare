import { USDT_ASSET_ID } from "next-common/hooks/ecoAssets/hydration/utils/constants";

export async function queryAssetPrice(sdk, assetIn, assetOut = USDT_ASSET_ID) {
  if (!assetIn || !assetOut || !sdk) return NaN;
  if (assetIn === assetOut) return 1;

  try {
    const result = await sdk.api.router.getBestSpotPrice(
      assetIn.toString(),
      assetOut.toString(),
    );
    if (result?.amount.isFinite()) {
      return result.amount
        .shiftedBy(-result.decimals)
        .decimalPlaces(10)
        .toString();
    }
  } catch (error) {
    console.error(error);
  }

  return NaN;
}
