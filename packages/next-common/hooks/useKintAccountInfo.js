import { useMemo } from "react";
import useKintOnChainAccountData from "./useKintOnChainAccountData";

function extractKintAccountInfo(accountData) {
  if (!accountData) {
    return null;
  }

  const { free, frozen, reserved } = accountData;

  return {
    data: {
      free: free?.toBigInt().toString(),
      reserved: reserved?.toBigInt().toString(),
      frozen: frozen?.toBigInt().toString(),
      total: (free?.toBigInt() + reserved?.toBigInt()).toString(),
    },
    detail: accountData?.toJSON(),
  };
}

export default function useKintAccountInfo(address) {
  const { data, isLoading } = useKintOnChainAccountData(address);

  const info = useMemo(() => {
    if (!data) {
      return null;
    }

    return extractKintAccountInfo(data);
  }, [data]);

  return {
    info,
    isLoading,
  };
}
