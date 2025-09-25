import BigNumber from "bignumber.js";
import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { useState, useCallback, useEffect, useMemo } from "react";
import { NATIVE_ASSET_ID } from "../utils";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

export default function useAccountBalance(
  address,
  allAssets,
  allAssetsLoading,
) {
  const [systemBalance, setSystemBalance] = useState(null);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [erc20Balances, setErc20Balances] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { all = [], native } = allAssets ?? {};

  const fetchBalance = useCallback(async () => {
    const { client } = sdk ?? {};
    const { balanceV2 } = client ?? {};
    const followedAssets = [];
    const followedErc20Tokens = [];
    if (allAssetsLoading) {
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
  }, [address, all, allAssetsLoading]);

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
