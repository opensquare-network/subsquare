import { useHydrationApi } from "next-common/context/hydration";
import useCall from "next-common/utils/hooks/useCall";

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

export function useQueryHydrationTreasuryBalances() {
  const api = useHydrationApi();
  const { loaded: isUsdtLoaded, value: accountUsdt } = useCall(
    api?.query.tokens?.accounts,
    [PolkadotTreasuryOnHydrationAccount, UsdtTokenIdFromAssetHub],
  );
  const { loaded: isUsdcLoaded, value: accountUsdc } = useCall(
    api?.query.tokens?.accounts,
    [PolkadotTreasuryOnHydrationAccount, UsdcTokenIdFromAssetHub],
  );
  const { loaded: isDotLoaded, value: accountDot } = useCall(
    api?.query.tokens?.accounts,
    [PolkadotTreasuryOnHydrationAccount, DotTokenId],
  );

  const isLoading = !isUsdtLoaded || !isUsdcLoaded || !isDotLoaded;

  const dot = getTotal(accountDot);
  const usdt = getTotal(accountUsdt);
  const usdc = getTotal(accountUsdc);

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
