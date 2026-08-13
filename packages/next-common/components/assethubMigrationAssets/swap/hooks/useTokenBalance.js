import { useAsync } from "react-use";
import { useAssetHubPapi } from "next-common/hooks/chain/useAssetHubApi";
import { buildBalanceQuery } from "../../liquidPools/useLiquidPools";

function getAvailableBalance(account, token) {
  if (token.type === "native") {
    const free = account?.data?.free ?? 0n;
    const frozen = account?.data?.frozen ?? 0n;
    return free > frozen ? free - frozen : 0n;
  }

  if (account?.status?.type !== "Liquid" || account?.balance == null) {
    return 0n;
  }

  return account.balance;
}

export default function useTokenBalance({ address, token }) {
  const papi = useAssetHubPapi();
  const canLoad = !!papi && !!address && !!token;
  const { value: balance = null, loading, error } = useAsync(async () => {
    if (!canLoad) {
      return null;
    }

    const account = await buildBalanceQuery(papi, token, address);
    return getAvailableBalance(account, token);
  }, [address, canLoad, papi, token]);

  return {
    balance,
    error: !!error,
    loading,
  };
}
