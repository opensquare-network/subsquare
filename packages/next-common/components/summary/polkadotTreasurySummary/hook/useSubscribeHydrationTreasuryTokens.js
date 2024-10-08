import { useHydrationApi } from "next-common/context/hydration";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { HydrationTreasuryAccount } from "next-common/hooks/treasury/useHydrationTreasuryBalance";

const AssetHubUSDTTokenID = 10;
const AssetHubUSDCTokenID = 22;

export function useSubscribeHydrationTreasuryTokens() {
  const api = useHydrationApi();
  const { loading: isLoadingUSDT, result: accountUsdt } = useSubStorage(
    "tokens",
    "accounts",
    [HydrationTreasuryAccount, AssetHubUSDTTokenID],
    { api },
  );
  const { loading: isLoadingUSDC, result: accountUsdc } = useSubStorage(
    "tokens",
    "accounts",
    [HydrationTreasuryAccount, AssetHubUSDCTokenID],
    { api },
  );

  const isLoading = isLoadingUSDT || isLoadingUSDC;

  return {
    usdt: accountUsdt?.free?.toJSON() || 0,
    usdc: accountUsdc?.free?.toJSON() || 0,
    isLoading,
  };
}
