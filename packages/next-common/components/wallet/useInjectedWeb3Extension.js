import { useCallback, useEffect, useState } from "react";
import useInjectedWeb3 from "./useInjectedWeb3";
import WalletTypes from "next-common/utils/consts/walletTypes";

export function useInjectedWeb3Extension(walletName) {
  const [extension, setExtension] = useState(null);
  const getInjectedWeb3Extension = useGetInjectedWeb3ExtensionFn();
  const { loading } = useInjectedWeb3();

  useEffect(() => {
    setExtension(getInjectedWeb3Extension(walletName));
  }, [walletName, getInjectedWeb3Extension]);

  return { extension, loading };
}

export function useGetInjectedWeb3ExtensionFn() {
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    (walletName) => {
      if (!walletName) {
        return null;
      }

      if (walletName === WalletTypes.NOVA) {
        return injectedWeb3?.[WalletTypes.POLKADOT_JS];
      }

      return injectedWeb3?.[walletName];
    },
    [injectedWeb3],
  );
}
