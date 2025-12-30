import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "react-use";
import { noop } from "lodash-es";
import { isSameAddress } from "next-common/utils";
import { CACHE_KEY } from "next-common/utils/constants";
import { VaultSignerProvider } from "./vaultSignerProvider";
import { useChain } from "../chain";

const defaultContext = {
  accounts: [],
  addAccount: noop,
  removeAccount: noop,
};

const PolkadotVaultContext = createContext(defaultContext);

export function PolkadotVaultProvider({ children }) {
  const chain = useChain();
  const [cacheAccounts, setCacheAccounts] = useLocalStorage(
    `${CACHE_KEY.polkadotVault}-${chain}`,
    [],
  );

  const addAccount = useCallback(
    (address, info) => {
      if (!address || !info) {
        console.warn("Invalid address or info provided to addAccount");
        return false;
      }

      const existingAccount = cacheAccounts.find((item) =>
        isSameAddress(item.address, address),
      );

      if (existingAccount) {
        console.warn(`Account with address ${address} already exists`);
        return false;
      }

      const newAccount = { ...info, address };
      setCacheAccounts([...(cacheAccounts || []), newAccount]);
      return true;
    },
    [cacheAccounts, setCacheAccounts],
  );

  const removeAccount = useCallback(
    (address) => {
      if (!address) {
        console.warn("Invalid address provided to removeAccount");
        return false;
      }

      setCacheAccounts((prevAccounts) => {
        if (!prevAccounts) return [];

        const filteredAccounts = cacheAccounts.filter(
          (item) => item.address !== address,
        );

        return filteredAccounts;
      });
      return true;
    },
    [cacheAccounts, setCacheAccounts],
  );

  const contextValue = {
    accounts: cacheAccounts,
    addAccount,
    removeAccount,
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
  const { accounts, addAccount, removeAccount } = usePolkadotVault();
  return {
    accounts,
    addAccount,
    removeAccount,
  };
};
