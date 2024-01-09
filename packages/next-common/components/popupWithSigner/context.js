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
import { useChain } from "next-common/context/chain";
import { getApiNormalizedAddress } from "next-common/utils/hydradxUtil";

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
  const chain = useChain();

  useEffect(() => {
    if (!userAddress) {
      return;
    }

    const account = extensionAccounts?.find((item) =>
      isSameAddress(item.address, userAddress),
    );

    if (!account) {
      setSignerAccount();
      return;
    }

    setSigner(account);

    const address = account?.address;

    setSignerAccount({
      ...account,
      name: account.meta?.name,
      address,
      normalizedAddress: getApiNormalizedAddress(address, chain),
      proxyAddress,
      normalizedProxyAddress: getApiNormalizedAddress(proxyAddress, chain),
      realAddress: proxyAddress || userAddress,
      normalizedRealAddress: getApiNormalizedAddress(
        proxyAddress || userAddress,
        chain,
      ),
    });
  }, [extensionAccounts, userAddress, proxyAddress, setSigner, chain]);

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

export function useApiNormalizedAddress(address) {
  const chain = useChain();
  return getApiNormalizedAddress(address, chain);
}
