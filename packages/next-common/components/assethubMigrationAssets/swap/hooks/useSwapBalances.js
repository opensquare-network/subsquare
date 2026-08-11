import { useCallback, useState } from "react";
import { useAsync } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import {
  buildBalanceQuery,
  readReserveBalance,
} from "../../liquidPools/useLiquidPools";

async function fetchTokenBalance(papi, token, address) {
  const account = await buildBalanceQuery(papi, token, address);
  return BigInt(readReserveBalance(account, token.type).toFixed(0));
}

function useTokenBalance({ address, refreshKey, token }) {
  const papi = useAssetHubPapi();
  const canLoad = !!address && !!papi && !!token;
  const { value: balance = null, loading } = useAsync(async () => {
    if (!canLoad) {
      return null;
    }

    try {
      return await fetchTokenBalance(papi, token, address);
    } catch (error) {
      console.error(`Failed to fetch ${token.symbol} balance`, error);
      return null;
    }
  }, [address, papi, refreshKey, token]);

  return { balance, loading };
}

export default function useSwapBalances({ address, tokenIn, tokenOut }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const tokenInState = useTokenBalance({
    address,
    refreshKey,
    token: tokenIn,
  });
  const tokenOutState = useTokenBalance({
    address,
    refreshKey,
    token: tokenOut,
  });
  const refresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  return {
    refresh,
    tokenIn: tokenInState.balance,
    tokenInLoading: tokenInState.loading,
    tokenOut: tokenOutState.balance,
    tokenOutLoading: tokenOutState.loading,
  };
}
