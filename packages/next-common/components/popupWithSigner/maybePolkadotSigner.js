import React, { useEffect, useState } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import useInjectedWeb3 from "../wallet/useInjectedWeb3";
import Popup from "../popup/wrapper/Popup";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { normalizeAddress } from "next-common/utils/address";
import WalletTypes from "next-common/utils/consts/walletTypes";

export default function MaybePolkadotSigner({
  onClose,
  autoCloseAfterLogin,
  title,
  Component,
  wide,
  maskClosable,
  className,
  ...props
}) {
  const dispatch = useDispatch();
  const { injectedWeb3, loading } = useInjectedWeb3();
  const [polkadotAccounts, setPolkadotAccounts] = useState([]);
  const [detecting, setDetecting] = useState(true);
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { chainType } = useChainSettings();

  useEffect(() => {
    (async () => {
      if (loading) {
        return;
      }

      try {
        if (!injectedWeb3) {
          return;
        }

        if (!lastConnectedAccount) {
          return;
        }

        const extension = injectedWeb3?.[lastConnectedAccount?.wallet];

        if (!extension) {
          return;
        }

        const wallet = await extension.enable("subsquare");
        const extensionAccounts = await wallet.accounts?.get();

        let filter = (item) => item.type !== "ethereum";
        if (chainType === ChainTypes.ETHEREUM) {
          filter = (item) => item.type === "ethereum";
        } else if (
          ChainTypes.MIXED === chainType &&
          lastConnectedAccount?.wallet === WalletTypes.TALISMAN
        ) {
          filter = () => true;
        }

        setPolkadotAccounts(
          extensionAccounts.filter(filter).map((item) => ({
            ...item,
            address: normalizeAddress(item.address),
            meta: {
              name: item.name,
              source: lastConnectedAccount?.wallet,
            },
          })),
        );
      } catch (e) {
        dispatch(newErrorToast(e.message));
        onClose();
      } finally {
        setDetecting(false);
      }
    })();
  }, [lastConnectedAccount, injectedWeb3, loading, chainType]);

  if (detecting) {
    return null;
  }

  return (
    <MaybeSignerConnected
      extensionAccounts={polkadotAccounts}
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
