import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSubBalanceInfo } from "../balance/useSubBalanceInfo";
import { useChainSettings } from "next-common/context/chain";

export function useMyNativeAsset() {
  const { decimals, symbol, name } = useChainSettings();

  const address = useRealAddress();
  const { value: balance, loading } = useSubBalanceInfo(address);

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
