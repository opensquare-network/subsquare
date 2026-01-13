import { noop } from "lodash-es";
import useMultisigAccount from "next-common/hooks/multisig/useMultisigAccount";
import { createContext, useContext } from "react";

export const MultisigAccountsContext = createContext({
  multisigs: [],
  refresh: noop,
  isLoading: false,
  total: 0,
});

export function MultisigAccountsProvider({ userAddress, children }) {
  const { multisigs, isLoading, total, refresh } =
    useMultisigAccount(userAddress);

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
