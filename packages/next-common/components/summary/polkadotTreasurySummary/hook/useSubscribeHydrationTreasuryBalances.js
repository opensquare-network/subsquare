import { useHydrationApi } from "next-common/context/hydration";
import useSubStorage from "next-common/hooks/common/useSubStorage";
import { toPrecision } from "next-common/utils";

const DotTokenId = 5;
const UsdtTokenIdFromAssetHub = 10;
const UsdcTokenIdFromAssetHub = 22;

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

  const dot =
    (accountDot?.free?.toBigInt() || 0n) +
    (accountDot?.reserved?.toBigInt() || 0n);
  const usdt = toPrecision(
    (accountUsdt?.free?.toBigInt() || 0n) +
      (accountUsdt?.reserved?.toBigInt() || 0n),
    6,
  );
  const usdc = toPrecision(
    (accountUsdc?.free?.toBigInt() || 0n) +
      (accountUsdc?.reserved?.toBigInt() || 0n),
    6,
  );

  return {
    dot,
    usdt,
    usdc,
    isLoading,
  };
}
