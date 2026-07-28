import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useEffect, useState } from "react";
import {
  getAssetBySymbol,
  StatemintFellowShipTreasuryAccount,
} from "./useAssetHubTreasuryBalance";

/**
 * Query the fellowship treasury's asset balance on Asset Hub.
 * The collectives chain's fellowship treasury account is on Asset Hub,
 * and non-native assets (USDT/USDC) must be queried via the Asset Hub API.
 */
export default function useAssetHubTreasuryBalanceFromCollectives(symbol) {
  const assetHubApi = useAssetHubApi();
  const treasuryAccount = StatemintFellowShipTreasuryAccount;

  const [balance, setBalance] = useState(0);
  const [decimals, setDecimals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assetHubApi || !treasuryAccount || !symbol) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const asset = getAssetBySymbol(symbol);
    if (!asset) {
      setBalance(0);
      setDecimals(0);
      setLoading(false);
      return;
    }

    setDecimals(asset.decimals);

    if (asset.type === "foreignAsset") {
      assetHubApi.query.foreignAssets
        .account(asset.multiLocation, treasuryAccount)
        .then((data) => {
          const assetInfo = data?.toJSON();
          setBalance(assetInfo?.balance || 0);
          setLoading(false);
        })
        .catch(() => {
          setBalance(0);
          setLoading(false);
        });
      return;
    }

    assetHubApi.query.assets
      .account(asset.id, treasuryAccount)
      .then((data) => {
        const assetInfo = data?.toJSON();
        setBalance(assetInfo?.balance || 0);
        setLoading(false);
      })
      .catch(() => {
        setBalance(0);
        setLoading(false);
      });
  }, [assetHubApi, treasuryAccount, symbol]);

  return {
    balance,
    decimals,
    loading,
  };
}
