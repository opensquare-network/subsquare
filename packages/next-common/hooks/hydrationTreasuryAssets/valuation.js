import BigNumber from "bignumber.js";
import { queryAssetPrice } from "next-common/hooks/ecoAssets/hydration/queryAssetPrice";

export const PRICE_FETCH_CONCURRENCY = 4;

export function toBigNumber(value) {
  const amount = new BigNumber(value?.toString?.() ?? value ?? 0);
  return amount.isFinite() ? amount : new BigNumber(0);
}

export function hasValidDecimals(asset) {
  return Number.isInteger(asset?.decimals) && asset.decimals >= 0;
}

export function toHumanAmount(amount, decimals) {
  return toBigNumber(amount).shiftedBy(-decimals);
}

export function getPrice(prices, assetId) {
  return prices.get(assetId?.toString()) ?? null;
}

export async function fetchAssetPrices(
  sdk,
  assetIds,
  concurrency = PRICE_FETCH_CONCURRENCY,
) {
  const ids = [...new Set([...assetIds].filter(Boolean).map(String))];
  const prices = new Map();
  let nextIndex = 0;

  const fetchNext = async () => {
    while (nextIndex < ids.length) {
      const assetId = ids[nextIndex++];
      try {
        const value = await queryAssetPrice(sdk, assetId);
        const price = toBigNumber(value);
        if (price.gt(0)) prices.set(assetId, price);
      } catch (error) {
        console.error(
          `Error fetching hydration treasury price for asset ${assetId}:`,
          error,
        );
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, ids.length) }, fetchNext),
  );

  return prices;
}
