import { useHydrationApi } from "next-common/context/hydration";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { HydrationTreasuryAccount } from "next-common/utils/hydration/consts";
import { toPrecision } from "next-common/utils";

const DotTokenIdFromAssetHub = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

export function useSubscribeHydrationTreasuryBalances() {
  const api = useHydrationApi();
  const { loading: isLoadingUSDT, result: accountUsdt } = useSubStorage(
    "tokens",
    "accounts",
    [HydrationTreasuryAccount, UsdtTokenIdFromAssetHub],
    { api },
  );
  const { loading: isLoadingUSDC, result: accountUsdc } = useSubStorage(
    "tokens",
    "accounts",
    [HydrationTreasuryAccount, UsdcTokenIdFromAssetHub],
    { api },
  );
  const { loading: isLoadingDOT, result: accountDot } = useSubStorage(
    "tokens",
    "accounts",
    [HydrationTreasuryAccount, DotTokenIdFromAssetHub],
    { api },
  );

  const isLoading = isLoadingUSDT || isLoadingUSDC || isLoadingDOT;

  const dot = accountDot?.free?.toJSON();
  const usdt = toPrecision(accountUsdt?.free?.toJSON() || 0, 6);
  const usdc = toPrecision(accountUsdc?.free?.toJSON() || 0, 6);

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
