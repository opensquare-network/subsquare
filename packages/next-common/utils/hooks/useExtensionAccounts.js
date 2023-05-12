import { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";
import { polkadotWeb3Accounts } from "../extensionAccount";
import { useChainSettings } from "next-common/context/chain";

export default function useExtensionAccounts(appName) {
  const isMounted = useIsMounted();
  const [hasExtension, setHasExtension] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accessible, seAccessible] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const { chainType } = useChainSettings();

  useEffect(() => {
    (async () => {
      const { isWeb3Injected, web3Enable } = await import(
        "@polkadot/extension-dapp"
      );

      const web3Apps = await web3Enable(appName);
      if (isMounted.current) {
        setHasExtension(isWeb3Injected);
      }
      if (!isWeb3Injected) {
        if (isMounted.current) {
          setDetecting(false);
        }
        return;
      }

      const accessEnabled = web3Apps?.length > 0;
      if (isMounted.current) {
        seAccessible(accessEnabled);
      }
      if (!accessEnabled) {
        if (isMounted.current) {
          setDetecting(false);
        }
        return;
      }

      const extensionAccounts = await polkadotWeb3Accounts(chainType);
      if (isMounted.current) {
        setAccounts(extensionAccounts);
        setDetecting(false);
      }
    })();
  }, [isMounted, chainType]);

  return { accounts, hasExtension, accessible, detecting };
}
