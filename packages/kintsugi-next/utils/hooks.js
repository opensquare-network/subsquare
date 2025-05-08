import { useEffect } from "react";
import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";
import useChainOrScanHeight from "next-common/hooks/height";

export function useLatestAddressVotingBalance(api, address) {
  const { balance, isLoading, refresh } = useAddressVotingBalance(api, address);
  const latestHeight = useChainOrScanHeight();

  useEffect(() => {
    refresh();
  }, [refresh, latestHeight]);

  return { balance, isLoading, refresh };
}
