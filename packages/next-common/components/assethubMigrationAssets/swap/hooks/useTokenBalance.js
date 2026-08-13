import { useAsync } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import {
  buildBalanceQuery,
  readReserveBalance,
} from "../../liquidPools/useLiquidPools";

export default function useTokenBalance({ address, token }) {
  const papi = useAssetHubPapi();
  const canLoad = !!papi && !!address && !!token;
  const { value: balance = null, loading, error } = useAsync(async () => {
    if (!canLoad) {
      return null;
    }

    const account = await buildBalanceQuery(papi, token, address);
    return BigInt(readReserveBalance(account, token.type).toFixed(0));
  }, [address, canLoad, papi, token]);

  return {
    balance,
    error: !!error,
    loading,
  };
}
