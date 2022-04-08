import { useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";
import {
  isWeb3Injected,
  web3Enable,
} from "@polkadot/extension-dapp";
import { polkadotWeb3Accounts } from "../extensionAccount";

export default function useExtensionAccounts(appName) {
  const isMounted = useIsMounted();
  const [hasExtension, setHasExtension] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [extensionAccessible, setExtensionAccessible] = useState(false);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    (async () => {
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
        setExtensionAccessible(accessEnabled);
      }
      if (!accessEnabled) {
        if (isMounted.current) {
          setDetecting(false);
        }
        return;
      }

      const extensionAccounts = await polkadotWeb3Accounts();
      if (isMounted.current) {
        setAccounts(extensionAccounts);
        setDetecting(false);
      }
    })();
  }, [isMounted]);

  return [accounts, hasExtension, extensionAccessible, detecting];
}
