import { useEffect, useMemo, useState } from "react";
import { Kintsugi, Interlay } from "@interlay/monetary-js";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import { useTreasuryAccount } from "./useTreasuryFree";
import {
  getAssetBySymbol,
  StatemintTreasuryAccount,
} from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import useQueryAssetHubAssets from "next-common/hooks/assetHub/useQueryAssetHubAssets";
import { useQueryAssetHubTreasuryFree } from "next-common/context/treasury/polkadotTreasury/hooks/useQueryAssetHubTreasuryFree";
import BigNumber from "bignumber.js";

const usdtAsset = getAssetBySymbol("USDT");
const usdcAsset = getAssetBySymbol("USDC");

export default function usePolkadotTreasuryTotal(api) {
  const {
    treasuryAccount,
    free: relayChainFree,
    isLoading: isRelayChainFreeLoading,
    usdt: relayChainUsdt,
    isLoading: isRelayChainUsdtLoading,
    usdc: relayChainUsdc,
    isLoading: isRelayChainUsdcLoading,
  } = useRelayChainTreasuryFreeTotal(api);
  const {
    nativeTreasuryBalanceOnAssetHub,
    isNativeTreasuryBalanceOnAssetHubLoading,
    usdtTreasuryBalanceOnAssetHub,
    isUsdtTreasuryBalanceOnAssetHubLoading,
    usdcTreasuryBalanceOnAssetHub,
    isUsdcTreasuryBalanceOnAssetHubLoading,
  } = useAssetHubTreasuryFreeTotal();

  const sumNative = useMemo(() => {
    return BigNumber(relayChainFree)
      .plus(nativeTreasuryBalanceOnAssetHub)
      .toString();
  }, [relayChainFree, nativeTreasuryBalanceOnAssetHub]);
  const sumUsdt = useMemo(() => {
    return BigNumber(relayChainUsdt)
      .plus(usdtTreasuryBalanceOnAssetHub)
      .toString();
  }, [relayChainUsdt, usdtTreasuryBalanceOnAssetHub]);
  const sumUsdc = useMemo(() => {
    return BigNumber(relayChainUsdc)
      .plus(usdcTreasuryBalanceOnAssetHub)
      .toString();
  }, [relayChainUsdc, usdcTreasuryBalanceOnAssetHub]);

  return {
    treasuryAccount,
    relayChainFree,
    native: sumNative,
    nativeLoading:
      isRelayChainFreeLoading || isNativeTreasuryBalanceOnAssetHubLoading,
    usdt: sumUsdt,
    usdtLoading:
      isRelayChainUsdtLoading || isUsdtTreasuryBalanceOnAssetHubLoading,
    usdc: sumUsdc,
    usdcLoading:
      isRelayChainUsdcLoading || isUsdcTreasuryBalanceOnAssetHubLoading,
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

function useRelayChainTreasuryFreeTotal(api) {
  const chain = useChain();
  const [free, setFree] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [usdtLoading, setUsdtLoading] = useState(true);
  const [usdcLoading, setUsdcLoading] = useState(true);
  const treasuryAccount = useTreasuryAccount(api);

  useEffect(() => {
    if (!treasuryAccount || !api) {
      return;
    }

    if ([Chains.kintsugi, Chains.interlay].includes(chain)) {
      const token =
        Chains.kintsugi === chain ? Kintsugi.ticker : Interlay.ticker;

      api.query.tokens
        .accounts(treasuryAccount, { token })
        .then((accountData) => {
          setFree(accountData ? accountData.free.toString() : "0");
          setIsLoading(false);
        });
    } else {
      api?.query.system.account?.(treasuryAccount).then((accountData) => {
        setFree(accountData ? accountData.data.free.toString() : "0");
        setIsLoading(false);
      });
    }

    api.query.assets.account(usdtAsset.id, treasuryAccount).then((data) => {
      const unwrappedData = data.unwrap();
      const balance = unwrappedData.balance.toString();
      setUsdtBalance(balance);
      setUsdtLoading(false);
    });
    api.query.assets.account(usdcAsset.id, treasuryAccount).then((data) => {
      const unwrappedData = data.unwrap();
      const balance = unwrappedData.balance.toString();
      setUsdcBalance(balance);
      setUsdcLoading(false);
    });
  }, [api, chain, treasuryAccount]);

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
