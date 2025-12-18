import BigNumber from "bignumber.js";
import { useState, useCallback, useEffect, useMemo } from "react";
import { NATIVE_ASSET_ID } from "../utils";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

export default function useAccountBalance(
  address,
  allAssets,
  allAssetsLoading,
) {
  const [systemBalance, setSystemBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [erc20Balances, setErc20Balances] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { all = [], native, shareTokens = [] } = allAssets ?? {};
  const sdk = useHydrationSDK();

  const fetchBalance = useCallback(async () => {
    const { client } = sdk ?? {};
    const { balanceV2 } = client ?? {};
    const followedAssets = [...shareTokens];
    const followedErc20Tokens = [];
    if (allAssetsLoading || !sdk) {
      return;
    }

    try {
      setIsLoading(true);

      for (const [, asset] of all) {
        if (!asset.isErc20 && asset.id !== NATIVE_ASSET_ID) {
          followedAssets.push(asset);
        } else if (asset.isErc20) {
          followedErc20Tokens.push(asset);
        }
      }
      const systemBalanceObj = await balanceV2.getSystemBalance(address);
      const tokenBalanceObj = await Promise.all(
        followedAssets.map(async (asset) => {
          const balance = await balanceV2.getTokenBalance(address, asset.id);

          return { balance, asset };
        }),
      );
      const erc20BalanceObj = await Promise.all(
        followedErc20Tokens.map(async (asset) => {
          const balance = await balanceV2.getErc20Balance(address, asset.id);

          return { balance, asset };
        }),
      );

      setSystemBalance(systemBalanceObj);
      setTokenBalances(tokenBalanceObj);
      setErc20Balances(erc20BalanceObj);
    } catch (error) {
      console.error("Error fetching account balance:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, all, allAssetsLoading, sdk, shareTokens]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const balances = useMemo(() => {
    return [
      { balance: systemBalance, asset: native },
      ...tokenBalances,
      ...erc20Balances,
    ];
  }, [systemBalance, native, tokenBalances, erc20Balances]);

  return { balances, isLoading };
}

export function useAccountAssetsMap(balances, isLoading) {
  return useMemo(() => {
    const newAccountAssetsMap = new Map();
    if (isLoading || !balances) {
      return newAccountAssetsMap;
    }

    for (const { balance, asset } of balances) {
      if (!BigNumber(balance.total).isZero() && asset?.id) {
        newAccountAssetsMap.set(asset.id, {
          balance,
          asset,
        });
      }
    }

    return newAccountAssetsMap;
  }, [balances, isLoading]);
}
