import { useSymbol } from "next-common/context/chain";
import useSubStorage from "../common/useSubStorage";

export default function useSubKintsugiAccountData(address) {
  const symbol = useSymbol();

  const { result: info, loading } = useSubStorage("tokens", "accounts", [
    address,
    { token: symbol },
  ]);

  return { data: info, isLoading: loading };
}
