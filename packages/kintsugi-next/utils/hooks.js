import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddressVotingBalance } from "next-common/utils/hooks/useAddressVotingBalance";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export function useLatestAddressVotingBalance(api, address) {
  const [balance, isLoading, refresh] = useAddressVotingBalance(api, address);
  const latestHeight = useSelector(chainOrScanHeightSelector);

  useEffect(() => {
    refresh();
  }, [refresh, latestHeight]);

  return [balance, isLoading, refresh];
}
