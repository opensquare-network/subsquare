import useSubStorage from "next-common/hooks/common/useSubStorage";
import { useMemo } from "react";

export default function useAssetAccountBalance(assetId, address) {
  const { loading, result } = useSubStorage("assets", "account", [
    assetId,
    address,
  ]);

  return useMemo(() => {
    if (loading) {
      return { loading: true, balance: null, transferrable: null };
    }

    // result is an Option type, check if it's None
    if (!result || result.isNone) {
      return { loading: false, balance: null, transferrable: null };
    }

    // Unwrap the Option to get the actual value
    const unwrapped = result.unwrap();
    const balance = unwrapped.balance?.toJSON?.() || unwrapped.balance?.toString() || "0";
    const isFrozen = unwrapped.status?.isFrozen;
    const transferrable = isFrozen ? "0" : balance;

    return {
      loading: false,
      balance,
      transferrable,
    };
  }, [loading, result]);
}
