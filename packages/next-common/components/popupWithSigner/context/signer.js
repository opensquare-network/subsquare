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
import { useConnectedAccount } from "next-common/context/connectedAccount";
import { isWatchOnlyAccount } from "next-common/utils/watchOnly";

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

      const wallet = await extension.enable("subsquare");
      if (wallet) {
        api?.setSigner(wallet.signer);
      }
    },
    [injectedWeb3],
  );
}

export function SignerContextProvider({ children, extensionAccounts }) {
  const user = useUser();
  const connectedAccount = useConnectedAccount();
  const userAddress = user?.address;
  const proxyAddress = user?.proxyAddress;
  const [selectedProxyAddress, setSelectedProxyAddress] = useState();
  const [multisig, setMultisig] = useState(user?.multisig);

  const realAddress = useMemo(() => {
    if (multisig) {
      return multisig.multisigAddress;
    }
    if (selectedProxyAddress) {
      return selectedProxyAddress;
    }
    if (proxyAddress) {
      return proxyAddress;
    }
    return userAddress;
  }, [multisig, selectedProxyAddress, proxyAddress, userAddress]);

  const signerAccount = useMemo(() => {
    if (!userAddress) {
      return;
    }

    const isWatchOnly = isWatchOnlyAccount(connectedAccount);
    const account = extensionAccounts?.find((item) =>
      isSameAddress(item.address, userAddress),
    );
    // The connected address may not be owned by any loaded wallet, e.g. a
    // watch-only address, a mock account, or an account of a wallet that is no
    // longer available. It is still the origin of the transaction.
    const connectedAccountInfo = account
      ? account
      : {
          address: userAddress,
          meta: { source: connectedAccount?.wallet },
        };

    return {
      ...connectedAccountInfo,
      name: connectedAccountInfo.meta?.name,
      proxyAddress,
      selectedProxyAddress,
      multisig,
      realAddress,
      isWatchOnly,
    };
  }, [
    userAddress,
    extensionAccounts,
    connectedAccount,
    proxyAddress,
    selectedProxyAddress,
    multisig,
    realAddress,
  ]);

  return (
    <SignerContext.Provider
      value={{
        extensionAccounts,
        signerAccount,
        setSelectedProxyAddress,
        setMultisig,
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

export function useCallerAddress() {
  const signerAccount = useSignerAccount();
  return signerAccount?.realAddress;
}
