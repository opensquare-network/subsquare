import {
  calculate_liquidity_lrna_out,
  calculate_liquidity_out,
} from "@galacticcouncil/math-omnipool";
import BigNumber from "bignumber.js";
import {
  HUB_ID,
  QUINTILL,
} from "next-common/hooks/ecoAssets/hydration/utils/constants";
import {
  getPrice,
  hasValidDecimals,
  toBigNumber,
  toHumanAmount,
} from "next-common/hooks/hydrationTreasuryAssets/valuation";

function unwrapOption(value) {
  if (!value || value.isSome === false) return null;
  return value.isSome === true ? value.unwrap() : value;
}

function getEntryArgs(entry) {
  return entry.args ?? entry[0]?.args;
}

function positionPriceToBigNumber(price) {
  const numerator = toBigNumber(price?.[0]);
  const denominator = toBigNumber(price?.[1]);
  return denominator.isZero() ? null : numerator.div(denominator);
}

function normalizeOmnipoolPosition(position, shares = position?.shares) {
  if (!position) return null;

  return {
    assetId: position.assetId.toString(),
    amountBase: toBigNumber(position.amount),
    sharesBase: toBigNumber(shares),
    entryPrice: positionPriceToBigNumber(position.price),
  };
}

function getOwnedNftIds(entries) {
  return entries
    .map((entry) => getEntryArgs(entry)?.[2]?.toString())
    .filter(Boolean);
}

async function fetchOmnipoolPositions(api, address, collectionId) {
  const entries = await api.query.uniques.account.entries(
    address,
    collectionId,
  );
  const positionIds = getOwnedNftIds(entries);
  if (!positionIds.length) return [];

  const positions = await api.query.omnipool.positions.multi(positionIds);
  return positions
    .map((value) => normalizeOmnipoolPosition(unwrapOption(value)))
    .filter(Boolean);
}

async function fetchOmnipoolMiningPositions(api, address, collectionId) {
  const entries = await api.query.uniques.account.entries(
    address,
    collectionId,
  );
  const miningIds = getOwnedNftIds(entries);
  if (!miningIds.length) return [];

  const [positionIds, deposits] = await Promise.all([
    api.query.omnipoolLiquidityMining.omniPositionId.multi(miningIds),
    api.query.omnipoolWarehouseLM.deposit.multi(miningIds),
  ]);

  const miningPositions = miningIds.flatMap((_, index) => {
    const positionId = unwrapOption(positionIds[index]);
    const deposit = unwrapOption(deposits[index]);
    if (!positionId || !deposit) return [];
    return [{ positionId: positionId.toString(), shares: deposit.shares }];
  });
  if (!miningPositions.length) return [];

  const positions = await api.query.omnipool.positions.multi(
    miningPositions.map(({ positionId }) => positionId),
  );

  return miningPositions
    .map(({ shares }, index) =>
      normalizeOmnipoolPosition(unwrapOption(positions[index]), shares),
    )
    .filter(Boolean);
}

async function fetchXykMiningDeposits(api, address, collectionId) {
  const entries = await api.query.uniques.account.entries(
    address,
    collectionId,
  );
  const miningIds = getOwnedNftIds(entries);
  if (!miningIds.length) return [];

  const deposits = await api.query.xykWarehouseLM.deposit.multi(miningIds);
  return deposits.flatMap((value) => {
    const deposit = unwrapOption(value);
    if (!deposit) return [];
    return [
      {
        poolAddress: deposit.ammPoolId.toString(),
        sharesBase: toBigNumber(deposit.shares),
      },
    ];
  });
}

async function fetchPoolMarkets(sdk) {
  const pools = await sdk.api.router.getPools();
  const omnipoolTokensById = new Map();
  const xykPoolsByAddress = new Map();

  for (const pool of pools) {
    if (pool.type === "Omnipool") {
      for (const token of pool.tokens) {
        const assetId = token.id.toString();
        if (assetId !== HUB_ID) omnipoolTokensById.set(assetId, token);
      }
    } else if (pool.type === "Xyk") {
      xykPoolsByAddress.set(pool.address.toString(), pool);
    }
  }

  return { omnipoolTokensById, xykPoolsByAddress };
}

function indexShareTokens(shareTokens) {
  const byId = new Map();
  const byPoolAddress = new Map();

  for (const shareToken of shareTokens) {
    if (shareToken?.id == null || !shareToken.poolAddress) continue;
    byId.set(shareToken.id.toString(), shareToken);
    byPoolAddress.set(shareToken.poolAddress.toString(), shareToken);
  }

  return { byId, byPoolAddress };
}

async function buildXykHoldings({
  api,
  tokenBalances,
  miningDeposits,
  shareTokens,
  poolsByAddress,
}) {
  const shareTokensBy = indexShareTokens(shareTokens);
  const sharesByPool = new Map();

  const addShares = (poolAddress, sharesBase) => {
    const normalizedAddress = poolAddress.toString();
    const current = sharesByPool.get(normalizedAddress) ?? new BigNumber(0);
    sharesByPool.set(normalizedAddress, current.plus(sharesBase));
  };

  for (const { assetId, balance } of tokenBalances) {
    const shareToken = shareTokensBy.byId.get(assetId);
    if (!shareToken || !balance.transferableBase.gt(0)) continue;
    addShares(shareToken.poolAddress, balance.transferableBase);
  }

  for (const { poolAddress, sharesBase } of miningDeposits) {
    if (sharesBase.gt(0)) addShares(poolAddress, sharesBase);
  }

  const poolAddresses = [...sharesByPool.keys()];
  if (!poolAddresses.length) return [];

  const totalLiquidity = await api.query.xyk.totalLiquidity.multi(
    poolAddresses,
  );

  return poolAddresses.map((poolAddress, index) => ({
    poolAddress,
    sharesBase: sharesByPool.get(poolAddress),
    shareToken: shareTokensBy.byPoolAddress.get(poolAddress),
    pool: poolsByAddress.get(poolAddress),
    totalLiquidityBase: toBigNumber(unwrapOption(totalLiquidity[index])),
  }));
}

export async function fetchLiquidityHoldings({
  sdk,
  api,
  address,
  assetsById,
  tokenBalances,
}) {
  const collectionIds = {
    omnipool: api.consts.omnipool.nftCollectionId.toString(),
    omnipoolMining:
      api.consts.omnipoolLiquidityMining.nftCollectionId.toString(),
    xykMining: api.consts.xykLiquidityMining.nftCollectionId.toString(),
  };

  const [markets, regularPositions, miningPositions, miningDeposits] =
    await Promise.all([
      fetchPoolMarkets(sdk),
      fetchOmnipoolPositions(api, address, collectionIds.omnipool),
      fetchOmnipoolMiningPositions(api, address, collectionIds.omnipoolMining),
      fetchXykMiningDeposits(api, address, collectionIds.xykMining),
    ]);

  const omnipool = [...regularPositions, ...miningPositions].map(
    (position) => ({
      ...position,
      asset: assetsById.get(position.assetId),
      poolToken: markets.omnipoolTokensById.get(position.assetId),
    }),
  );
  const stableSwap = tokenBalances.filter(
    ({ asset, balance }) => asset.isStableSwap && balance.totalBase.gt(0),
  );
  const shareTokens = [...assetsById.values()].filter(
    (asset) => asset.isShareToken,
  );
  const xyk = await buildXykHoldings({
    api,
    tokenBalances,
    miningDeposits,
    shareTokens,
    poolsByAddress: markets.xykPoolsByAddress,
  });

  return {
    omnipool,
    stableSwap,
    xyk,
    hubAsset: assetsById.get(HUB_ID),
  };
}

export function collectLiquidityPriceIds(holdings) {
  const assetIds = new Set();

  if (holdings.omnipool.length) assetIds.add(HUB_ID);
  for (const { assetId } of holdings.omnipool) assetIds.add(assetId);
  for (const { assetId } of holdings.stableSwap) assetIds.add(assetId);
  for (const { pool } of holdings.xyk) {
    for (const token of pool?.tokens ?? []) {
      assetIds.add(token.id.toString());
    }
  }

  return assetIds;
}

function valueOmnipoolPosition(position, hubAsset, prices) {
  const { assetId, asset, poolToken, amountBase, sharesBase, entryPrice } =
    position;
  const assetPriceUsd = getPrice(prices, assetId);
  if (!poolToken || !assetPriceUsd || !hasValidDecimals(asset) || !entryPrice) {
    return null;
  }

  const hubReserves = poolToken.hubReserves ?? poolToken.hubReserve;
  if (hubReserves == null) return null;
  const params = [
    poolToken.balance.toString(),
    hubReserves.toString(),
    poolToken.shares.toString(),
    amountBase.toFixed(0),
    sharesBase.toFixed(0),
    entryPrice.shiftedBy(QUINTILL).toFixed(0),
    sharesBase.toFixed(0),
    "0",
  ];
  const liquidityBase = calculate_liquidity_out(...params);
  if (liquidityBase === "-1") return null;

  let valueUsd = toHumanAmount(liquidityBase, asset.decimals).times(
    assetPriceUsd,
  );
  const hubLiquidityBase = calculate_liquidity_lrna_out(...params);
  const hubPriceUsd = getPrice(prices, HUB_ID);
  if (
    hubLiquidityBase !== "-1" &&
    toBigNumber(hubLiquidityBase).gt(0) &&
    hubPriceUsd &&
    hasValidDecimals(hubAsset)
  ) {
    valueUsd = valueUsd.plus(
      toHumanAmount(hubLiquidityBase, hubAsset.decimals).times(hubPriceUsd),
    );
  }

  return valueUsd;
}

function valueOmnipool(holdings, prices) {
  return holdings.omnipool.reduce((total, position) => {
    const valueUsd = valueOmnipoolPosition(position, holdings.hubAsset, prices);
    return valueUsd ? total.plus(valueUsd) : total;
  }, new BigNumber(0));
}

function valueStableSwap(holdings, prices) {
  return holdings.stableSwap.reduce((total, holding) => {
    const priceUsd = getPrice(prices, holding.assetId);
    if (!priceUsd || !hasValidDecimals(holding.asset)) return total;
    const valueUsd = toHumanAmount(
      holding.balance.totalBase,
      holding.asset.decimals,
    ).times(priceUsd);
    return valueUsd.gt(0) ? total.plus(valueUsd) : total;
  }, new BigNumber(0));
}

function valueXyk(holdings, prices) {
  return holdings.xyk.reduce((total, holding) => {
    const { pool, shareToken, sharesBase, totalLiquidityBase } = holding;
    if (!pool || !hasValidDecimals(shareToken) || !totalLiquidityBase.gt(0)) {
      return total;
    }

    const totalLiquidity = toHumanAmount(
      totalLiquidityBase,
      shareToken.decimals,
    );
    let sharePriceUsd = null;
    for (const token of pool.tokens ?? []) {
      const tokenPriceUsd = getPrice(prices, token.id);
      if (!tokenPriceUsd || !hasValidDecimals(token)) continue;
      const poolValueUsd = toHumanAmount(token.balance, token.decimals)
        .times(2)
        .times(tokenPriceUsd);
      sharePriceUsd = poolValueUsd.div(totalLiquidity);
      break;
    }
    if (!sharePriceUsd) return total;

    const valueUsd = toHumanAmount(sharesBase, shareToken.decimals).times(
      sharePriceUsd,
    );
    return valueUsd.gt(0) ? total.plus(valueUsd) : total;
  }, new BigNumber(0));
}

export function valueLiquidityHoldings(holdings, prices) {
  const omnipoolUsd = valueOmnipool(holdings, prices);
  const stableSwapUsd = valueStableSwap(holdings, prices);
  const xykUsd = valueXyk(holdings, prices);

  return {
    totalUsd: omnipoolUsd.plus(stableSwapUsd).plus(xykUsd),
    omnipoolUsd,
    stableSwapUsd,
    xykUsd,
  };
}
