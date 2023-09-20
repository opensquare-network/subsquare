import { useCallback, useEffect, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";

export default function useKintOnChainAccountData(address) {
  const chain = useChain();
  const api = useApi();
  const [accountData, setAccountData] = useState();

  const fetchAccountData = useCallback(async () => {
    if (!api || !address) {
      return;
    }

    const token = Chains.kintsugi === chain ? "KINT" : "INTR";
    const account = await api.query.tokens.accounts(address, { token });

    if (!account) {
      setAccountData(null);
      return;
    }

    setAccountData(account);
  }, [api, address, chain]);

  useEffect(() => {
    fetchAccountData().catch(() => setAccountData(null));
  }, [fetchAccountData]);

  return accountData;
}
