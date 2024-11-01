import { useAssetHubApi } from "next-common/context/assetHub";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useEffect, useState } from "react";

export default function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();
  const [balance, setBalance] = useState(0);
  const [decimals, setDecimals] = useState(0);

  const { loading: isLoadingAccount, result: account } = useSubStorage(
    "assets",
    "account",
    [assetId, address],
    { api },
  );
  const { loading: isLoadingMeta, result: meta } = useSubStorage(
    "assets",
    "metadata",
    [assetId],
    { api },
  );

  const loading = isLoadingAccount || isLoadingMeta;

  useEffect(() => {
    if (loading) return;

    setBalance(account?.toJSON()?.balance || 0);
    setDecimals(meta?.toJSON()?.decimals || 0);
  }, [loading, account, meta]);

  return { isLoading: loading, balance, decimals };
}
