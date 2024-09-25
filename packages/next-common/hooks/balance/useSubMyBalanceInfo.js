import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSubBalanceInfo } from "./useSubBalanceInfo";

export function useSubMyBalanceInfo() {
  const address = useRealAddress();
  return useSubBalanceInfo(address);
}
