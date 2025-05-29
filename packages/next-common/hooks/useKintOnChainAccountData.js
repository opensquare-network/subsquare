import { useCallback, useEffect, useState } from "react";
import Chains from "next-common/utils/consts/chains";
import { useChain } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export default function useKintOnChainAccountData(address) {
  const chain = useChain();
  const api = useContextApi();
  const [accountData, setAccountData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountData = useCallback(async () => {
    if (!api || !address) {
      return;
    }
    setIsLoading(true);

    const token = Chains.kintsugi === chain ? "KINT" : "INTR";
    const account = await api.query.tokens.accounts(address, { token });

    if (!account) {
      setAccountData(null);
      setIsLoading(false);
      return;
    }

    setAccountData(account);
    setIsLoading(false);
  }, [api, address, chain]);

  useEffect(() => {
    fetchAccountData().catch(() => setAccountData(null));
  }, [fetchAccountData]);

  return {
    data: accountData,
    isLoading,
  };
}
