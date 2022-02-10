import { useState, useEffect } from "react";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import {
  isWeb3Injected,
  web3Accounts,
  web3Enable,
} from "@polkadot/extension-dapp";

export function useExtensionAccounts(appName) {
  const isMounted = useIsMounted();
  const [hasExtension, setHasExtension] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [extensionAccessible, setExtensionAccessible] = useState(false);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    (async () => {
      setHasExtension(isWeb3Injected);
      if (!isWeb3Injected) {
        setDetecting(false);
        return;
      }

      const web3Apps = await web3Enable(appName);
      const accessEnabled = web3Apps?.length > 0;
      if (isMounted.current) {
        setExtensionAccessible(accessEnabled);
      }
      if (!accessEnabled) {
        if (isMounted.current) {
          setDetecting(false);
        }
        return;
      }

      const extensionAccounts = await web3Accounts();
      if (isMounted.current) {
        setAccounts(extensionAccounts);
        setDetecting(false);
      }
    })();
  }, [isMounted]);

  return [accounts, hasExtension, extensionAccessible, detecting];
}
