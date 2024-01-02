import WalletTypes from "next-common/utils/consts/walletTypes";
import useApi from "next-common/utils/hooks/useApi";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useInjectedWeb3 from "../wallet/useInjectedWeb3";
import { useUser } from "next-common/context/user";
import { isSameAddress } from "next-common/utils";

export const SignerContext = createContext();

export default SignerContext;

function useSetSigner() {
  const api = useApi();
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    async (account) => {
      if (!account) {
        return;
      }

      if (account.meta?.source === WalletTypes.METAMASK) {
        return;
      }

      if (!injectedWeb3) {
        return;
      }

      const extension = injectedWeb3?.[account.meta?.source];
      if (!extension) {
        return;
      }

      const wallet = await extension.enable("subsquare");
      if (wallet) {
        api?.setSigner(wallet.signer);
      }
    },
    [injectedWeb3, api],
  );
}

export function SignerContextProvider({ children, extensionAccounts }) {
  const [signerAccount, setSignerAccount] = useState();
  const user = useUser();
  const userAddress = user?.address;
  const proxyAddress = user?.proxyAddress;
  const setSigner = useSetSigner();

  useEffect(() => {
    if (!userAddress) {
      return;
    }

    let account = null;

    // Check user login address first
    if (userAddress) {
      account = extensionAccounts?.find((item) =>
        isSameAddress(item.address, userAddress),
      );
    }

    if (!account) {
      setSignerAccount();
      return;
    }

    setSigner(account);

    setSignerAccount({
      ...account,
      name: account.meta?.name,
      proxyAddress,
      realAddress: proxyAddress || userAddress,
    });
  }, [extensionAccounts, userAddress, proxyAddress, setSigner]);

  return (
    <SignerContext.Provider
      value={{
        extensionAccounts,
        signerAccount,
      }}
    >
      {children}
    </SignerContext.Provider>
  );
}

export function useSignerAccount() {
  const { signerAccount } = useContext(SignerContext);
  return signerAccount;
}

export function useExtensionAccounts() {
  const { extensionAccounts } = useContext(SignerContext);
  return extensionAccounts;
}
