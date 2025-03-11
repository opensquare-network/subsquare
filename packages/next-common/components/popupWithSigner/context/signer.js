import WalletTypes from "next-common/utils/consts/walletTypes";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useInjectedWeb3 from "next-common/hooks/connect/useInjectedWeb3";
import { useUser } from "next-common/context/user";
import { isSameAddress } from "next-common/utils";
import { findInjectedExtension } from "next-common/hooks/connect/useInjectedWeb3Extension";

export const SignerContext = createContext();

export default SignerContext;

export function useSetSigner() {
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    async (api, account) => {
      if (!account) {
        return;
      }

      if (account.meta?.source === WalletTypes.METAMASK) {
        return;
      }

      if (!injectedWeb3) {
        return;
      }

      const extension = findInjectedExtension(
        account.meta?.source,
        injectedWeb3,
      );
      if (!extension) {
        return;
      }

      try {
        const wallet = await extension.enable("subsquare");
        if (wallet) {
          api?.setSigner(wallet.signer);
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    [injectedWeb3],
  );
}

export function SignerContextProvider({ children, extensionAccounts }) {
  const user = useUser();
  const userAddress = user?.address;
  const [proxyAddress, setProxyAddress] = useState(user?.proxyAddress);
  const signerAccount = useMemo(() => {
    if (!userAddress) {
      return;
    }
    const account = extensionAccounts?.find((item) =>
      isSameAddress(item.address, userAddress),
    );
    if (!account) {
      return;
    }
    return {
      ...account,
      name: account.meta?.name,
      proxyAddress,
      realAddress: proxyAddress || userAddress,
    };
  }, [extensionAccounts, userAddress, proxyAddress]);

  return (
    <SignerContext.Provider
      value={{
        extensionAccounts,
        signerAccount,
        setProxyAddress,
      }}
    >
      {children}
    </SignerContext.Provider>
  );
}

export function useSignerContext() {
  return useContext(SignerContext);
}

export function useSignerAccount() {
  const value = useContext(SignerContext);
  return value?.signerAccount;
}

export function useExtensionAccounts() {
  const value = useContext(SignerContext);
  return value?.extensionAccounts;
}
