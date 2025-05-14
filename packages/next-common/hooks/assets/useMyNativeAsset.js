import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { useAccountBalanceInfo } from "../balance/useAccountBalanceInfo";

export function useMyNativeAsset() {
  const { decimals, symbol, name } = useChainSettings();

  const address = useRealAddress();
  const { value: balance, loading } = useAccountBalanceInfo(address);

  return {
    loading,
    value: {
      ...balance,
      decimals,
      symbol,
      name,
      type: "native",
    },
  };
}
