import { useEffect, useState } from "react";
import { useSubMyAsset } from "./useSubMyAsset";

export function useMyAsset() {
  const balanceObj = useSubMyAsset();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (balanceObj) {
      setLoading(false);
    }
  }, [balanceObj]);

  return {
    loading,
    value: {
      ...balanceObj,
    },
  };
}
