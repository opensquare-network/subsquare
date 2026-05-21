import { useContextApi } from "next-common/context/api";
import { useEffect, useMemo, useState } from "react";
import { getAssetBySymbol } from "./useAssetHubTreasuryBalance";
import { useTreasuryAccount } from "next-common/utils/hooks/useTreasuryFree";
import { useChainSettings } from "next-common/context/chain";
import { ASSET_TYPE } from "next-common/utils/treasury/multiAssetBounty/assetKind";

export default function useAssetBalance(account, assetInfo) {
  const api = useContextApi();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  const {
    symbol,
    decimals = 0,
    assetType,
    foreignAssetLocation,
  } = assetInfo ?? {};

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!account) {
      return;
    }

    setLoading(true);

    if (assetType === ASSET_TYPE.native) {
      api.query.system.account(account).then((data) => {
        const accountInfo = data?.toJSON();
        setBalance(accountInfo?.data?.free);
        setLoading(false);
      });
      return;
    }

    if (assetType === ASSET_TYPE.crosschainNative) {
      if (!foreignAssetLocation) {
        return;
      }
      api.query.foreignAssets
        .account(foreignAssetLocation, account)
        .then((data) => {
          const foreignAssetAccount = data?.toJSON();
          setBalance(foreignAssetAccount?.balance);
          setLoading(false);
        });
      return;
    }

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      return;
    }

    api.query.assets.account(asset.id, account).then((data) => {
      const assetAccount = data?.toJSON();
      setBalance(assetAccount?.balance);
      setLoading(false);
    });
  }, [api, account, symbol, assetType, foreignAssetLocation]);

  return {
    balance,
    decimals,
    loading,
  };
}

export function useTreasuryAssetBalance(symbol) {
  const api = useContextApi();
  const { symbol: nativeSymbol, decimals: nativeDecimals } = useChainSettings();
  const treasuryAccount = useTreasuryAccount(api);

  const assetInfo = useMemo(() => {
    if (symbol === nativeSymbol) {
      return {
        symbol,
        decimals: nativeDecimals,
        assetType: ASSET_TYPE.native,
      };
    }

    const assetData = getAssetBySymbol(symbol);
    if (assetData) {
      return {
        symbol,
        decimals: assetData.decimals,
        assetType: ASSET_TYPE.assets,
      };
    }

    return null;
  }, [symbol, nativeSymbol, nativeDecimals]);

  return useAssetBalance(treasuryAccount, assetInfo);
}
