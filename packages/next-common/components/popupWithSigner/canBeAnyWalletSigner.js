import React, { useEffect, useMemo, useState } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import Popup from "../popup/wrapper/Popup";
import { useMetaMaskAccounts } from "../../utils/metamask";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { useChainSettings } from "next-common/context/chain";
import { normalizeAddress } from "next-common/utils/address";

function usePolkadotAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { chainType } = useChainSettings();

  useEffect(() => {
    (async () => {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );

      await web3Enable("subsquare");
      const injectedAccounts = await web3Accounts();

      let filter = (item) => item.type !== "ethereum";
      if (chainType === ChainTypes.ETHEREUM) {
        filter = (item) => item.type === "ethereum";
      }
      setAccounts(
        injectedAccounts.filter(filter).map((item) => ({
          ...item,
          address: normalizeAddress(item.address),
        })),
      );
      setIsLoading(false);
    })();
  }, [chainType]);

  return [accounts, isLoading];
}

export default function CanBeAnyWalletSigner({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  wide,
  maskClosable,
  className,
  ...props
}) {
  const [metamaskAccounts, isLoadingMetamask] = useMetaMaskAccounts(true);
  const [polkadotAccounts, isLoadingPolkadot] = usePolkadotAccounts(true);

  const combinedAccounts = useMemo(
    () => [...metamaskAccounts, ...polkadotAccounts],
    [metamaskAccounts, polkadotAccounts],
  );

  if (isLoadingMetamask || isLoadingPolkadot) {
    return null;
  }

  return (
    <MaybeSignerConnected
      extensionAccounts={combinedAccounts}
      onClose={onClose}
      autoCloseAfterLogin={autoCloseAfterLogin}
    >
      <Popup
        wide={wide}
        onClose={onClose}
        title={title}
        maskClosable={maskClosable}
        className={className}
      >
        <Component onClose={onClose} {...props} />
      </Popup>
    </MaybeSignerConnected>
  );
}
