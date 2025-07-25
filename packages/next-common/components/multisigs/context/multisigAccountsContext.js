import { noop } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const MultisigAccountsContext = createContext({
  multisigs: [],
  refresh: noop,
  isLoading: false,
  total: 0,
});

export function MultisigAccountsProvider({ userAddress, children }) {
  const [now, setNow] = useState(Date.now());
  const [multisigs, setMultisigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchMultisigs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { result } = await nextApi.fetch(`users/${userAddress}/multisigs`);
      setMultisigs(result);
      setTotal(result?.length || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMultisigs();
  }, [fetchMultisigs, now]);

  const refresh = useCallback(() => {
    setNow(Date.now());
  }, []);

  return (
    <MultisigAccountsContext.Provider
      value={{ multisigs, refresh, isLoading, total }}
    >
      {children}
    </MultisigAccountsContext.Provider>
  );
}

export function useMultisigAccounts() {
  return useContext(MultisigAccountsContext);
}
