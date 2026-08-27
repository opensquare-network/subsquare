import BigNumber from "bignumber.js";
import {
  getPrice,
  hasValidDecimals,
  toBigNumber,
  toHumanAmount,
} from "next-common/hooks/hydrationTreasuryAssets/valuation";

function normalizeBalance(balance = {}) {
  const freeBase = toBigNumber(balance.free);
  const reservedBase = toBigNumber(balance.reserved);
  const frozenBase = toBigNumber(balance.frozen);
  const lockedBase = BigNumber.maximum(frozenBase.minus(reservedBase), 0);

  return {
    freeBase,
    reservedBase,
    frozenBase,
    totalBase: freeBase.plus(reservedBase),
    transferableBase: BigNumber.maximum(freeBase.minus(lockedBase), 0),
  };
}

function normalizeTokenBalances(entries, assetsById) {
  const balances = [];

  for (const entry of entries) {
    const args = entry.args ?? entry[0]?.args;
    const value = entry.value ?? entry[1];
    const assetId = args?.[1]?.toString();
    const asset = assetId && assetsById.get(assetId);
    if (!asset) continue;

    balances.push({
      assetId,
      asset,
      balance: normalizeBalance(value),
      source: "token",
    });
  }

  return balances;
}

async function fetchSystemAccountOrNull(api, address) {
  try {
    return await api.query.system.account(address);
  } catch (error) {
    console.error("Error fetching hydration treasury native balance:", error);
    return null;
  }
}

async function fetchTokenEntriesOrEmpty(api, address) {
  try {
    return await api.query.tokens.accounts.entries(address);
  } catch (error) {
    console.error("Error fetching hydration treasury token balances:", error);
    return [];
  }
}

async function fetchErc20Balances(sdk, address, assetsById) {
  const erc20Assets = [...assetsById.values()].filter((asset) => asset.isErc20);

  const balances = await Promise.all(
    erc20Assets.map(async (asset) => {
      try {
        const balance = await sdk.client.balanceV2.getErc20Balance(
          address,
          asset.id,
        );
        return {
          assetId: asset.id.toString(),
          asset,
          balance: normalizeBalance(balance),
          source: "erc20",
        };
      } catch {
        return null;
      }
    }),
  );

  return balances.filter(Boolean);
}

export async function fetchAccountHoldings({
  sdk,
  api,
  address,
  assetsById,
  nativeAsset,
}) {
  const [systemAccount, tokenEntries, erc20Balances] = await Promise.all([
    fetchSystemAccountOrNull(api, address),
    fetchTokenEntriesOrEmpty(api, address),
    fetchErc20Balances(sdk, address, assetsById),
  ]);

  const tokenBalances = normalizeTokenBalances(tokenEntries, assetsById);
  const nativeBalance = nativeAsset
    ? {
        assetId: nativeAsset.id.toString(),
        asset: nativeAsset,
        balance: normalizeBalance(systemAccount?.data),
        source: "native",
      }
    : null;

  const assetBalances = [nativeBalance, ...tokenBalances, ...erc20Balances]
    .filter(Boolean)
    .filter(({ asset, balance, source }) => {
      if (!balance.totalBase.gt(0)) return false;
      if (source !== "token") return true;
      return asset.isToken && !asset.isStableSwap && !asset.isShareToken;
    });

  return {
    walletHoldings: assetBalances,
    tokenBalances,
  };
}

export function collectAssetPriceIds(assetBalances) {
  return new Set(
    assetBalances
      .filter(({ asset }) => hasValidDecimals(asset))
      .map(({ assetId }) => assetId),
  );
}

export function valueAssetHoldings(assetBalances, prices) {
  const assets = [];
  let totalUsd = new BigNumber(0);

  for (const { assetId, asset, balance, source } of assetBalances) {
    if (!hasValidDecimals(asset)) continue;
    const priceUsd = getPrice(prices, assetId);
    if (!priceUsd) continue;

    const amount = toHumanAmount(balance.totalBase, asset.decimals);
    const valueUsd = amount.times(priceUsd);
    totalUsd = totalUsd.plus(valueUsd);
    assets.push({
      id: assetId,
      symbol: asset.symbol,
      decimals: asset.decimals,
      balance: amount,
      price: priceUsd,
      value: valueUsd,
      isNative: source === "native",
    });
  }

  return { assets, totalUsd };
}
