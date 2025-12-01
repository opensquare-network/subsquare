import { useSymbol } from "next-common/context/chain";
import useSubStorage from "../common/useSubStorage";
import { useMemo } from "react";

export default function useSubKintsugiAccount(address) {
  const symbol = useSymbol();

  const tokenSymbol = useMemo(() => {
    return { token: symbol };
  }, [symbol]);

  const { result, loading } = useSubStorage("tokens", "accounts", [
    address,
    tokenSymbol,
  ]);

  return { data: result, isLoading: loading };
}
