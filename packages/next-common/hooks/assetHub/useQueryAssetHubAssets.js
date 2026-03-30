import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { useEffect, useState } from "react";

export default function useQueryAssetHubAssets(assetId, address) {
  const papi = useAssetHubPapi();
  const [state, setState] = useState({
    isLoading: true,
    balance: 0,
    decimals: 0,
  });

  useEffect(() => {
    if (!papi || !assetId || !address) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));

    Promise.all([
      papi.query.Assets.Account.getValue(assetId, address),
      papi.query.Assets.Metadata.getValue(assetId),
    ])
      .then(([account, meta]) => {
        setState({
          isLoading: false,
          balance: account?.balance?.toString?.() || 0,
          decimals: meta?.decimals || 0,
        });
      })
      .catch(() => {
        setState({
          isLoading: false,
          balance: 0,
          decimals: 0,
        });
      });
  }, [papi, assetId, address]);

  return state;
}
