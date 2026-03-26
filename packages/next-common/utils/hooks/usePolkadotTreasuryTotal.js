import { useEffect, useMemo, useState } from "react";
import { Kintsugi, Interlay } from "@interlay/monetary-js";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import {
  getAssetBySymbol,
  StatemintTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useQueryAssetHubAssets from "next-common/hooks/assetHub/useQueryAssetHubAssets";
import { useQueryAssetHubTreasuryFree } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryAssetHubTreasuryFree";
import BigNumber from "bignumber.js";
import { useTreasuryAccountWithPapi } from "./useTreasuryFreeWithPapi";

const usdtAsset = getAssetBySymbol("USDT");
const usdcAsset = getAssetBySymbol("USDC");

export default function usePolkadotTreasuryTotal(papi) {
  const {
    treasuryAccount,
    free: nativeFree,
    isLoading: isNativeFreeLoading,
    usdt: usdtBalance,
    isUsdtLoading: isUsdtBalanceLoading,
    usdc: usdcBalance,
    isUsdcLoading: isUsdcBalanceLoading,
  } = useRelayChainTreasuryFreeTotal(papi);

  const {
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
    usdtTreasuryBalanceOnAssetHub,
    isUsdtTreasuryBalanceOnAssetHubLoading,
    usdcTreasuryBalanceOnAssetHub,
    isUsdcTreasuryBalanceOnAssetHubLoading,
  } = useAssetHubTreasuryFreeTotal();

  const totalNativeFree = useMemo(() => {
    return BigNumber(nativeFree)
      .plus(nativeTreasuryBalanceOnAssetHub)
      .toString();
  }, [nativeFree, nativeTreasuryBalanceOnAssetHub]);

  const totalUsdtBalance = useMemo(() => {
    return BigNumber(usdtBalance)
      .plus(usdtTreasuryBalanceOnAssetHub)
      .toString();
  }, [usdtBalance, usdtTreasuryBalanceOnAssetHub]);

  const totalUsdcBalance = useMemo(() => {
    return BigNumber(usdcBalance)
      .plus(usdcTreasuryBalanceOnAssetHub)
      .toString();
  }, [usdcBalance, usdcTreasuryBalanceOnAssetHub]);

  return {
    treasuryAccount,
    relayChainTreasuryBalance: nativeFree,
    isRelayChainTreasuryBalanceLoading: isNativeFreeLoading,
    totalNativeFree,
    isNativeLoading:
      isNativeFreeLoading || isNativeTreasuryBalanceOnAssetHubLoading,
    totalUsdtBalance,
    isUsdtLoading:
      isUsdtBalanceLoading || isUsdtTreasuryBalanceOnAssetHubLoading,
    totalUsdcBalance,
    isUsdcLoading:
      isUsdcBalanceLoading || isUsdcTreasuryBalanceOnAssetHubLoading,
  };
}

function useTreasuryAccountAssetBalance(symbol) {
  const asset = getAssetBySymbol(symbol);
  return useQueryAssetHubAssets(asset.id, StatemintTreasuryAccount);
}

function useAssetHubTreasuryFreeTotal() {
  const {
    free: nativeTreasuryBalanceOnAssetHub,
    isLoading: isNativeTreasuryBalanceOnAssetHubLoading,
  } = useQueryAssetHubTreasuryFree(StatemintTreasuryAccount);

  const {
    balance: usdtTreasuryBalanceOnAssetHub,
    isLoading: isUsdtTreasuryBalanceOnAssetHubLoading,
  } = useTreasuryAccountAssetBalance("USDT");

  const {
    balance: usdcTreasuryBalanceOnAssetHub,
    isLoading: isUsdcTreasuryBalanceOnAssetHubLoading,
  } = useTreasuryAccountAssetBalance("USDC");

  return {
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
    usdtTreasuryBalanceOnAssetHub,
    isUsdtTreasuryBalanceOnAssetHubLoading,
    usdcTreasuryBalanceOnAssetHub,
    isUsdcTreasuryBalanceOnAssetHubLoading,
  };
}

function useRelayChainTreasuryFreeTotal(papi) {
  const chain = useChain();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [usdtLoading, setUsdtLoading] = useState(true);
  const [usdcLoading, setUsdcLoading] = useState(true);
  const treasuryAccount = useTreasuryAccountWithPapi(papi);

  useEffect(() => {
    if (!treasuryAccount || !papi) {
      return;
    }

    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      const token =
        Chains.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;

      papi.query.Tokens.Accounts.getValue(treasuryAccount, { token })
        .then((accountData) => {
          setFree(accountData ? accountData.free.toString() : "0");
          setIsLoading(false);
        });
    } else {
      papi?.query?.System?.Account?.getValue?.(treasuryAccount).then(
        (accountData) => {
          setFree(accountData ? accountData.data.free.toString() : "0");
          setIsLoading(false);
        },
      );
    }

    Promise.allSettled([
      papi.query.Assets.Account.getValue(usdtAsset.id, treasuryAccount),
      papi.query.Assets.Account.getValue(usdcAsset.id, treasuryAccount),
    ]).then(([usdtData, usdcData]) => {
      if (usdtData.status === "fulfilled") {
        setUsdtBalance(usdtData.value?.balance?.toString?.() || 0);
      }
      setUsdtLoading(false);

      if (usdcData.status === "fulfilled") {
        setUsdcBalance(usdcData.value?.balance?.toString?.() || 0);
      }
      setUsdcLoading(false);
    });
  }, [papi, chain, treasuryAccount]);

  return {
    treasuryAccount,
    free,
    isLoading,
    usdt: usdtBalance,
    isUsdtLoading: usdtLoading,
    usdc: usdcBalance,
    isUsdcLoading: usdcLoading,
  };
}
