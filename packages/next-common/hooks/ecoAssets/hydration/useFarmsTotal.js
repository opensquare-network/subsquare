import BigNumber from "bignumber.js";
import { useMemo, useState, useEffect } from "react";
import useAccountPositions from "./common/useAccountPosition";
import useLiquidityPositionData from "./common/useLiquidityPositionData";
import { useAllAssetsFunc } from "./common/useAllAssets";
import { useHydrationSDK } from "./context/hydrationSDKContext";
import { queryAssetPrice } from "./useAssetsTotal";
import { BN_0 } from "./utils";

const useAllXYKDeposits = (address) => {
  const { data: accountPositions } = useAccountPositions(address);
  const { xykDeposits = [] } = accountPositions ?? {};
  const { getShareTokenByAddress } = useAllAssetsFunc();
  const sdk = useHydrationSDK();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const depositsKey = useMemo(() => {
    return JSON.stringify(xykDeposits.map(d => d.id));
  }, [xykDeposits]);

  useEffect(() => {
    let cancelled = false;

    const calculateDeposits = async () => {
      if (!xykDeposits.length || !sdk || !getShareTokenByAddress) {
        if (!cancelled) {
          setData({});
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setIsLoading(true);
      }

      try {
        const result = {};

        for (const depositNft of xykDeposits) {
          if (cancelled) break;

          const asset = getShareTokenByAddress(
            depositNft.data.ammPoolId.toString(),
          );

          if (!asset) {
            continue;
          }

          const shares = BigNumber(depositNft.data.shares.toString());
          const spotPrice = await queryAssetPrice(sdk, asset.id, "10");

          if (cancelled) break;

          if (!spotPrice || isNaN(spotPrice)) {
            continue;
          }

          const amountUSD = shares
            .shiftedBy(-asset.decimals)
            .multipliedBy(spotPrice);

          const index = asset.id;
          result[index] = [
            ...(result[index] ?? []),
            {
              amountUSD,
              assetId: asset.id,
              depositId: depositNft.id,
            },
          ];
        }

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error calculating XYK deposits:", error);
          setData({});
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    calculateDeposits();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositsKey, sdk]);

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

export default function useFarmsTotal(address) {
  const { omnipool, xyk } = useAllFarmDeposits(address);

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

  return { isLoading: !total, balance: total };
}
