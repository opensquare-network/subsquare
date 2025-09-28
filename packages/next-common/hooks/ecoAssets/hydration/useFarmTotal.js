import BigNumber from "bignumber.js";
import { useMemo } from "react";
import useAccountPositions from "./common/useAccountPosition";
import useLiquidityPositionData from "./common/useLiquidityPositionData";
import { useAllAssetsFunc } from "./common/useAllAssets";
import useTotalIssuances from "./common/useTotalIssuances";
import { useXYKSDKPools } from "./common/useHydrationPools";
import useDisplayShareTokenPrice from "./common/useDisplayShareTokenPrice";
import { scaleHuman, BN_0 } from "./utils";

const useAllXYKDeposits = (address) => {
  const { data: accountPositions } = useAccountPositions(address);
  const { xykDeposits = [] } = accountPositions ?? {};
  const { getShareTokenByAddress } = useAllAssetsFunc();
  const issuances = useTotalIssuances();

  const depositNftsData = xykDeposits.reduce((acc, depositNft) => {
    const asset = getShareTokenByAddress(depositNft.data.ammPoolId.toString());

    if (asset)
      acc.push({
        asset,
        depositNft,
      });
    return acc;
  }, []);

  const uniqAssetIds = [
    ...new Set(depositNftsData.map((deposit) => deposit.asset.id)),
  ];

  const shareTokeSpotPrices = useDisplayShareTokenPrice(uniqAssetIds);
  const { data: xykPools, isLoading: isXykPoolsLoading } = useXYKSDKPools();

  const isLoading =
    isXykPoolsLoading ||
    issuances.isLoading ||
    shareTokeSpotPrices.isInitialLoading;

  const data = useMemo(() => {
    if (isLoading) {
      return {};
    }
    return depositNftsData.reduce((acc, deposit) => {
      const { asset, depositNft } = deposit;
      const shareTokenIssuance = issuances?.data?.get(asset.id);

      const pool = xykPools?.find((pool) => pool.address === asset.poolAddress);

      if (shareTokenIssuance && pool) {
        const index = asset.id;
        const shares = depositNft.data.shares;
        const ratio = BigNumber(shares).div(shareTokenIssuance);
        const amountUSD = scaleHuman(shareTokenIssuance, asset.decimals)
          .multipliedBy(shareTokeSpotPrices.data?.[0]?.spotPrice ?? 1)
          .times(ratio);

        const [assetA, assetB] = pool.tokens.map((token) => {
          const amount = scaleHuman(
            BigNumber(token.balance).times(ratio),
            token.decimals,
          );

          return {
            id: token.id,
            symbol: token.symbol,
            decimals: token.decimals,
            amount,
          };
        });

        acc[index] = [
          ...(acc[index] ?? []),
          {
            assetA,
            assetB,
            amountUSD,
            assetId: asset.id,
            depositId: depositNft.id,
          },
        ];
      }

      return acc;
    }, {});
  }, [
    depositNftsData,
    issuances?.data,
    xykPools,
    shareTokeSpotPrices?.data,
    isLoading,
  ]);

  return { data, isLoading };
};

const useAllOmnipoolDeposits = (address) => {
  const { data: accountPositions } = useAccountPositions(address);
  const { depositLiquidityPositions = [] } = accountPositions ?? {};

  const { getData } = useLiquidityPositionData();

  const data = useMemo(
    () =>
      depositLiquidityPositions.reduce((memo, position) => {
        const positionData = getData(position);

        if (positionData) {
          const index = position.assetId;

          memo[index] = [
            ...(memo[index] ?? []),
            {
              ...positionData,
              depositId: position.depositId,
            },
          ];
        }

        return memo;
      }, {}),

    [getData, depositLiquidityPositions],
  );

  return data;
};

function useAllFarmDeposits(address) {
  const omnipoolDepositValues = useAllOmnipoolDeposits(address);
  const xykDepositValues = useAllXYKDeposits(address);

  const isLoading = xykDepositValues.isLoading;

  return {
    isLoading,
    omnipool: omnipoolDepositValues,
    xyk: xykDepositValues.data,
  };
}

export default function useFarmTotal(address) {
  const { isLoading, omnipool, xyk } = useAllFarmDeposits(address);

  const total = useMemo(() => {
    let poolsTotal = BN_0;

    for (const poolId in omnipool) {
      const poolTotal = omnipool[poolId].reduce((memo, share) => {
        return memo.plus(share.valueDisplay);
      }, BN_0);
      poolsTotal = poolsTotal.plus(poolTotal);
    }

    for (const id in xyk) {
      const xykTotal = xyk[id].reduce((memo, deposit) => {
        if (deposit.amountUSD) {
          memo = memo.plus(deposit.amountUSD);
        }
        return memo;
      }, BN_0);

      poolsTotal = poolsTotal.plus(xykTotal);
    }

    return poolsTotal.toString();
  }, [omnipool, xyk]);

  return { isLoading: isLoading, balance: total };
}
