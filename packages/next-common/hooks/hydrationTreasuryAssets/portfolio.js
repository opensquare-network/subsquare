import { AaveClient, H160 } from "@galacticcouncil/sdk";
import BigNumber from "bignumber.js";
import { NATIVE_ASSET_ID } from "next-common/hooks/ecoAssets/hydration/utils/constants";
import { external } from "next-common/hooks/ecoAssets/hydration/utils/assetUtils";
import {
  collectAssetPriceIds,
  fetchAccountHoldings,
  valueAssetHoldings,
} from "next-common/hooks/hydrationTreasuryAssets/account";
import {
  collectLiquidityPriceIds,
  fetchLiquidityHoldings,
  valueLiquidityHoldings,
} from "next-common/hooks/hydrationTreasuryAssets/liquidity";
import {
  fetchAssetPrices,
  toBigNumber,
} from "next-common/hooks/hydrationTreasuryAssets/valuation";

const TOP_ASSETS_COUNT = 5;

function buildAssetCatalog(allAssets) {
  const assetsById = new Map();

  for (const asset of allAssets?.all?.values?.() ?? []) {
    if (asset?.id != null) assetsById.set(asset.id.toString(), asset);
  }

  const shareTokens = allAssets?.shareTokens ?? [
    ...(allAssets?.shareTokensMap?.values?.() ?? []),
  ];
  for (const shareToken of shareTokens) {
    if (shareToken?.id != null) {
      assetsById.set(shareToken.id.toString(), shareToken);
    }
  }

  return {
    assetsById,
    nativeAsset: assetsById.get(NATIVE_ASSET_ID) ?? allAssets?.native ?? null,
  };
}

export function valueBorrowUsd(totalDebt, baseCurrencyData) {
  const referenceUnit = toBigNumber(
    baseCurrencyData.marketReferenceCurrencyUnit,
  );
  const referencePriceUsd = toBigNumber(
    baseCurrencyData.marketReferenceCurrencyPriceInUsd,
  );
  if (referenceUnit.isZero()) return new BigNumber(0);

  return toBigNumber(totalDebt)
    .times(referencePriceUsd)
    .div(referenceUnit.shiftedBy(8));
}

async function fetchBorrowValueUsd(sdk, address) {
  const aaveClient = new AaveClient(sdk.evm);
  const [, baseCurrencyData] = await aaveClient.getReservesData();
  const [, totalDebt] = await aaveClient.getUserAccountData(
    H160.fromAny(address),
  );
  return valueBorrowUsd(totalDebt, baseCurrencyData);
}

async function fetchBorrowValueOrZero(sdk, address) {
  try {
    return await fetchBorrowValueUsd(sdk, address);
  } catch (error) {
    console.error("Error fetching hydration treasury borrow:", error);
    return new BigNumber(0);
  }
}

async function fetchLiquidityOrEmpty(options) {
  try {
    return await fetchLiquidityHoldings(options);
  } catch (error) {
    console.error("Error fetching hydration treasury liquidity:", error);
    return {
      omnipool: [],
      stableSwap: [],
      xyk: [],
      hubAsset: options.assetsById.get("1"),
    };
  }
}

function valueLiquidityOrZero(holdings, prices) {
  try {
    return valueLiquidityHoldings(holdings, prices);
  } catch (error) {
    console.error("Error valuing hydration treasury liquidity:", error);
    return {
      totalUsd: new BigNumber(0),
      omnipoolUsd: new BigNumber(0),
      stableSwapUsd: new BigNumber(0),
      xykUsd: new BigNumber(0),
    };
  }
}

function selectTopAssets(assets) {
  return [...assets]
    .sort((left, right) => right.value.comparedTo(left.value))
    .slice(0, TOP_ASSETS_COUNT);
}

export function composePortfolio({ assetValues, liquidityValues, borrowUsd }) {
  return {
    total: assetValues.totalUsd.plus(liquidityValues.totalUsd).minus(borrowUsd),
    assetsTotal: assetValues.totalUsd,
    assets: selectTopAssets(assetValues.assets),
    liquidity: liquidityValues.totalUsd,
    borrow: borrowUsd,
  };
}

export async function fetchHydrationTreasuryPortfolio({
  sdk,
  api,
  allAssets,
  address,
}) {
  await sdk.ctx.pool.syncRegistry(external);

  const { assetsById, nativeAsset } = buildAssetCatalog(allAssets);
  const borrowPromise = fetchBorrowValueOrZero(sdk, address);
  const account = await fetchAccountHoldings({
    sdk,
    api,
    address,
    assetsById,
    nativeAsset,
  });
  const liquidity = await fetchLiquidityOrEmpty({
    sdk,
    api,
    address,
    assetsById,
    tokenBalances: account.tokenBalances,
  });

  const priceIds = new Set([
    ...collectAssetPriceIds(account.walletHoldings),
    ...collectLiquidityPriceIds(liquidity),
  ]);
  const [prices, borrowUsd] = await Promise.all([
    fetchAssetPrices(sdk, priceIds),
    borrowPromise,
  ]);
  const assetValues = valueAssetHoldings(account.walletHoldings, prices);
  const liquidityValues = valueLiquidityOrZero(liquidity, prices);

  return composePortfolio({ assetValues, liquidityValues, borrowUsd });
}
