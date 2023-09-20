import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";

export default function useOnChainAccountData(address) {
  const api = useApi();
  const [accountData, setAccountData] = useState();

  const fetchAccountData = useCallback(async () => {
    if (!api || !address) {
      return;
    }

    const [account, balanceAll, stakingInfo] = await Promise.all([
      api.query.system.account(address),
      api.derive.balances?.all(address).catch(() => null),
      api.derive.staking?.account(address).catch(() => null),
    ]);

    if (!account) {
      setAccountData(null);
      return;
    }

    setAccountData({
      account,
      balanceAll,
      stakingInfo,
    });
  }, [api, address]);

  useEffect(() => {
    fetchAccountData().catch(() => setAccountData(null));
  }, [fetchAccountData]);

  return accountData;
}
