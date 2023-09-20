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
  const accountData = useKintOnChainAccountData(address);
  return useMemo(() => {
    if (!accountData) {
      return null;
    }
    return extractKintAccountInfo(accountData);
  }, [accountData]);
}
