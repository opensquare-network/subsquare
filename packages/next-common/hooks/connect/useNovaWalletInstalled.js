// https://docs.novawallet.io/nova-wallet-wiki/misc/developer-documentation/intergrate-nova-wallet

import { isNil } from "lodash-es";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useIsMountedBool } from "next-common/utils/hooks/useIsMounted";
import { useEffect, useState } from "react";

export function useNovaWalletInstalled() {
  const isMountedBool = useIsMountedBool();
  const { loading, injectedWeb3 } = useInjectedWeb3();
  const [substrateInstalled, setSubstrateInstalled] = useState(false);
  const [evmInstalled, seEvmInstalled] = useState(false);

  useEffect(() => {
    // update if installed changes
    if (loading) {
      return;
    }

    if (isMountedBool()) {
      const substrateDetected =
        !isNil(injectedWeb3?.["polkadot-js"]) &&
        window.walletExtension?.isNovaWallet === true;

      const evmDetected = window.ethereum?.isNovaWallet;

      setSubstrateInstalled(substrateDetected);
      seEvmInstalled(evmDetected);
    }
  }, [isMountedBool, loading, injectedWeb3]);

  return {
    substrate: substrateInstalled,
    evm: evmInstalled,
  };
}
