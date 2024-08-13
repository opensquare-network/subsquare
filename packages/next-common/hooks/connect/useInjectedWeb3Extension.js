import { useCallback, useEffect, useState } from "react";
import useInjectedWeb3 from "./useInjectedWeb3";
import WalletTypes from "next-common/utils/consts/walletTypes";

export function findInjectedExtension(walletName, injectedWeb3) {
  if (!walletName) {
    return null;
  }

  if (walletName === WalletTypes.NOVA) {
    return injectedWeb3?.[WalletTypes.POLKADOT_JS];
  }

  return injectedWeb3?.[walletName];
}

export function useInjectedWeb3Extension(walletName) {
  const [extension, setExtension] = useState(null);
  const { injectedWeb3, loading } = useInjectedWeb3();

  useEffect(() => {
    const extension = findInjectedExtension(walletName, injectedWeb3);
    setExtension(extension);
  }, [walletName, injectedWeb3]);

  return { injectedWeb3Extension: extension, loading };
}

export function useGetInjectedWeb3ExtensionFn() {
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    (walletName) => findInjectedExtension(walletName, injectedWeb3),
    [injectedWeb3],
  );
}
