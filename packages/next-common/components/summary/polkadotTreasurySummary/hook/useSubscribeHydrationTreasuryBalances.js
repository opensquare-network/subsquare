import { useHydrationApi } from "next-common/context/hydration";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";

const DotTokenId = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

function getTotal(account) {
  return (
    (account?.free?.toBigInt() || 0n) + (account?.reserved?.toBigInt() || 0n)
  ).toString();
}

export const PolkadotTreasuryOnHydrationAccount =
  "7KCp4eenFS4CowF9SpQE5BBCj5MtoBA3K811tNyRmhLfH1aV";

export function useSubscribeHydrationTreasuryBalances() {
  const api = useHydrationApi();
  const { loading: isLoadingUSDT, result: accountUsdt } = useSubStorage(
    "tokens",
    "accounts",
    [PolkadotTreasuryOnHydrationAccount, UsdtTokenIdFromAssetHub],
    { api },
  );
  const { loading: isLoadingUSDC, result: accountUsdc } = useSubStorage(
    "tokens",
    "accounts",
    [PolkadotTreasuryOnHydrationAccount, UsdcTokenIdFromAssetHub],
    { api },
  );
  const { loading: isLoadingDOT, result: accountDot } = useSubStorage(
    "tokens",
    "accounts",
    [PolkadotTreasuryOnHydrationAccount, DotTokenId],
    { api },
  );

  const isLoading = isLoadingUSDT || isLoadingUSDC || isLoadingDOT;

  const dot = getTotal(accountDot);
  const usdt = toPrecision(getTotal(accountUsdt), 6);
  const usdc = toPrecision(getTotal(accountUsdc), 6);

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
