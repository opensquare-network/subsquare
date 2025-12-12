import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "react-use";
import { noop } from "lodash-es";
import { encodeAddressToChain } from "next-common/services/address";
import { isSameAddress } from "next-common/utils";
import { CACHE_KEY } from "next-common/utils/constants";
import { VaultSignerProvider } from "./vaultSignerProvider";
import { useChain } from "../chain";

const defaultContext = {
  accounts: [],
  addAccount: noop,
  removeAccount: noop,
  updateAccount: noop,
  clearAccounts: noop,
  getAccount: noop,
};

const PolkadotVaultContext = createContext(defaultContext);

export function PolkadotVaultProvider({ children }) {
  const chain = useChain();
  const [cache, setAccounts] = useLocalStorage(
    CACHE_KEY.polkadotVault + chain,
    [],
  );

  const accounts = useMemo(() => {
    return cache.map((item) => {
      return {
        ...item,
        address: encodeAddressToChain(item.address, chain),
      };
    });
  }, [cache, chain]);

  const addAccount = useCallback(
    (address, info) => {
      if (!address || !info) {
        console.warn("Invalid address or info provided to addAccount");
        return false;
      }

      const existingAccount = accounts?.find((item) =>
        isSameAddress(item.address, address),
      );

      if (existingAccount) {
        console.warn(`Account with address ${address} already exists`);
        return false;
      }

      const newAccount = { ...info, address };
      setAccounts((prevAccounts) => [...(prevAccounts || []), newAccount]);
      return true;
    },
    [accounts, setAccounts],
  );

  const updateAccount = useCallback(
    (oldAddress, newInfo) => {
      if (!oldAddress || !newInfo) {
        console.warn("Invalid address or info provided to updateAccount");
        return false;
      }
      setAccounts((prevAccounts) => {
        const index = prevAccounts.findIndex((item) =>
          isSameAddress(item.address, oldAddress),
        );
        if (index >= 0) {
          prevAccounts[index] = { ...prevAccounts[index], ...newInfo };
        }
        return prevAccounts;
      });
    },
    [setAccounts],
  );

  const removeAccount = useCallback(
    (address) => {
      if (!address) {
        console.warn("Invalid address provided to removeAccount");
        return false;
      }

      setAccounts((prevAccounts) => {
        if (!prevAccounts) return [];

        const filteredAccounts = prevAccounts.filter(
          (item) => !isSameAddress(item.address, address),
        );
        if (filteredAccounts.length === prevAccounts.length) {
          console.warn(`Account with address ${address} not found`);
          return prevAccounts;
        }

        return filteredAccounts;
      });
      return true;
    },
    [setAccounts],
  );

  const clearAccounts = useCallback(() => {
    setAccounts([]);
  }, [setAccounts]);

  const getAccount = useCallback(
    (address) => {
      if (!address) return null;
      return (
        accounts?.find((item) => isSameAddress(item.address, address)) || null
      );
    },
    [accounts],
  );

  const contextValue = {
    accounts: accounts || [],
    addAccount,
    removeAccount,
    updateAccount,
    clearAccounts,
    getAccount,
  };

  return (
    <PolkadotVaultContext.Provider value={contextValue}>
      <VaultSignerProvider>{children}</VaultSignerProvider>
    </PolkadotVaultContext.Provider>
  );
}

export const usePolkadotVault = () => {
  const context = useContext(PolkadotVaultContext);
  if (!context) {
    throw new Error(
      "usePolkadotVault must be used within a PolkadotVaultProvider",
    );
  }
  return context;
};

export const usePolkadotVaultAccounts = () => {
  const { accounts, addAccount, removeAccount, updateAccount, clearAccounts } =
    usePolkadotVault();
  return {
    accounts,
    addAccount,
    removeAccount,
    updateAccount,
    clearAccounts,
  };
};
