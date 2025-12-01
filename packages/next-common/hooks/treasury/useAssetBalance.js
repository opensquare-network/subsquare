import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";
import { getAssetBySymbol } from "./useAssetHubTreasuryBalance";
import { useTreasuryAccount } from "next-common/utils/hooks/useTreasuryFree";
import { useChainSettings } from "next-common/context/chain";

export default function useAssetBalance(account, symbol) {
  const api = useContextApi();
  const [decimals, setDecimals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!account) {
      return;
    }

    setLoading(true);

    if (symbol === nativeSymbol) {
      setDecimals(nativeDecimals);
      api.query.system.account(account).then((data) => {
        const accountInfo = data?.toJSON();
        setBalance(accountInfo?.data?.free);
        setLoading(false);
      });
      return;
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      return;
    }

    setDecimals(asset.decimals);

    api.query.assets.account(asset.id, account).then((data) => {
      const assetInfo = data?.toJSON();
      setBalance(assetInfo?.balance);
      setLoading(false);
    });
  }, [api, account, symbol, nativeSymbol, nativeDecimals]);

  return {
    balance,
    decimals,
    loading,
  };
}

export function useTreasuryAssetBalance(symbol) {
  const api = useContextApi();
  const treasuryAccount = useTreasuryAccount(api);
  return useAssetBalance(treasuryAccount, symbol);
}
