import React, { useEffect, useState } from "react";
import MaybeSignerConnected from "./maybeSignerConnected";
import useInjectedWeb3 from "../wallet/useInjectedWeb3";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useChainSettings } from "next-common/context/chain";
import ChainTypes from "next-common/utils/consts/chainTypes";
import { normalizeAddress } from "next-common/utils/address";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { usePopupParams } from "./context";
import { useIsNovaWallet } from "next-common/hooks/connect/useIsNovaWallet";

export default function MaybePolkadotSigner({ children }) {
  const dispatch = useDispatch();
  const { injectedWeb3, loading } = useInjectedWeb3();
  const [polkadotAccounts, setPolkadotAccounts] = useState([]);
  const [detecting, setDetecting] = useState(true);
  const { lastConnectedAccount } = useConnectedAccountContext();
  const { chainType } = useChainSettings();
  const { onClose } = usePopupParams();
  const isNovaWallet = useIsNovaWallet();

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

        let extension;
        if (isNovaWallet) {
          extension = injectedWeb3?.["polkadot-js"];
        } else {
          extension = injectedWeb3?.[lastConnectedAccount?.wallet];
        }

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
  }, [lastConnectedAccount, injectedWeb3, loading, chainType, isNovaWallet]);

  if (detecting) {
    return null;
  }

  return (
    <MaybeSignerConnected extensionAccounts={polkadotAccounts}>
      {children}
    </MaybeSignerConnected>
  );
}
