import { useChain } from "next-common/context/chain";
import { getApiNormalizedAddress } from "next-common/utils/hydradxUtil";

export function useApiNormalizedAddress(address) {
  const chain = useChain();
  return getApiNormalizedAddress(address, chain);
}
