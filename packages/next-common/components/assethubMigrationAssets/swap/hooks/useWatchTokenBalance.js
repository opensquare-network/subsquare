import { useEffect, useState } from "react";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { readReserveBalance } from "../../liquidPools/useLiquidPools";

function watchTokenAccount(papi, token, address) {
  if (token.type === "native") {
    return papi.query.System.Account.watchValue(address);
  }
  if (token.type === "asset") {
    return papi.query.Assets.Account.watchValue(token.assetId, address);
  }
  return papi.query.ForeignAssets.Account.watchValue(token.location, address);
}

export default function useWatchTokenBalance({ address, token }) {
  const papi = useAssetHubPapi();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBalance(null);

    if (!papi || !address || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const subscription = watchTokenAccount(papi, token, address).subscribe(
      ({ value: account }) => {
        setBalance(BigInt(readReserveBalance(account, token.type).toFixed(0)));
        setLoading(false);
      },
      (error) => {
        console.error(`Failed to watch ${token.symbol} balance`, error);
        setLoading(false);
      },
    );

    return () => subscription?.unsubscribe();
  }, [address, papi, token]);

  return { balance, loading };
}
