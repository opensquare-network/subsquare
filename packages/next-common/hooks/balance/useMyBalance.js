import { useEffect, useState } from "react";
import { useSubMyBalanceInfo } from "./useSubMyBalanceInfo";

export function useMyBalance() {
  const balance = useSubMyBalanceInfo();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (balance) {
      setLoading(false);
    }
  }, [balance]);

  return {
    loading,
    value: {
      ...balance,
    },
  };
}
