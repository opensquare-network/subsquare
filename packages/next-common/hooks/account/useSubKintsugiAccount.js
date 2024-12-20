import { useSymbol } from "next-common/context/chain";
import useSubStorage from "../common/useSubStorage";

export default function useSubKintsugiAccount(address) {
  const symbol = useSymbol();

  const { result, loading } = useSubStorage("tokens", "accounts", [
    address,
    { token: symbol },
  ]);

  return { data: result, isLoading: loading };
}
