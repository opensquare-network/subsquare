import { useMyBalance } from "../balance/useMyBalance";

export function useMyNativeAsset() {
  const { value: balance, loading } = useMyBalance();

  return {
    loading,
    value: {
      ...balance,
      type: "native",
    },
  };
}
