import React, { useState, useCallback } from "react";
import { getWallets } from "../../utils/consts/connect";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { useDispatch } from "react-redux";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { useChainSettings } from "next-common/context/chain";
import useInjectedWeb3 from "./useInjectedWeb3";
import PolkadotWallet from "./polkadotWallet";
import { MetaMaskWallet } from "./metamaskWallet";
import { NovaWallet } from "./novaWallet";
import {
  addNetwork,
  getChainId,
  getMetaMaskEthereum,
  normalizedMetaMaskAccounts,
  requestAccounts,
} from "next-common/utils/metamask";
import ChainTypes from "next-common/utils/consts/chainTypes";
import WalletTypes from "next-common/utils/consts/walletTypes";
import isEvmChain from "next-common/utils/isEvmChain";
import noop from "lodash.noop";

export default function SelectWallet({
  selectedWallet,
  setSelectWallet,
  setAccounts,
  setWallet = noop,
  onSelect = noop,
  onAccessGranted = noop,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);
  const { injectedWeb3 } = useInjectedWeb3();
  const { chainType, ethereumNetwork } = useChainSettings();

  const loadPolkadotAccounts = useCallback(
    async (selectedWallet) => {
      setAccounts(null);
      const extension = injectedWeb3?.[selectedWallet];
      if (!extension) {
        return;
      }

      try {
        setWaitingPermissionWallet(selectedWallet);
        const wallet = await extension.enable("subsquare");
        let extensionAccounts = await wallet.accounts?.get();
        if (chainType === ChainTypes.ETHEREUM) {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type === ChainTypes.ETHEREUM,
          );
        } else if (chainType !== ChainTypes.MIXED) {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type !== ChainTypes.ETHEREUM,
          );
        }

        if (isMounted.current) {
          setSelectWallet(selectedWallet);
          setWallet(wallet);
          setAccounts(extensionAccounts);
        }

        onAccessGranted && onAccessGranted();
      } catch (e) {
        dispatch(newErrorToast(e.message));
      } finally {
        if (isMounted.current) {
          setWaitingPermissionWallet(null);
        }
      }
    },
    [
      injectedWeb3,
      setAccounts,
      setSelectWallet,
      setWallet,
      onAccessGranted,
      isMounted,
      chainType,
    ],
  );

  const loadMetaMaskAccounts = useCallback(
    async (selectedWallet) => {
      const ethereum = getMetaMaskEthereum();
      if (!ethereum) {
        dispatch(newErrorToast("Please install MetaMask"));
        return;
      }

      try {
        const chainId = await getChainId();
        if (chainId !== ethereumNetwork.chainId) {
          await addNetwork(ethereumNetwork);
        }

        const accounts = await requestAccounts();
        if (isMounted.current) {
          setSelectWallet(selectedWallet);
          setWallet();
          setAccounts(normalizedMetaMaskAccounts(accounts));
        }
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [
      dispatch,
      isMounted,
      setWallet,
      setSelectWallet,
      setAccounts,
      ethereumNetwork,
    ],
  );

  const loadWalletAccounts = useCallback(
    async (wallet) => {
      if (!wallet) {
        return;
      }

      setSelectWallet(wallet);

      switch (wallet) {
        case WalletTypes.POLKADOT_JS:
        case WalletTypes.POLKAGATE:
        case WalletTypes.SUBWALLET_JS:
        case WalletTypes.TALISMAN: {
          await loadPolkadotAccounts(wallet);
          break;
        }
        case WalletTypes.METAMASK: {
          await loadMetaMaskAccounts(wallet);
          break;
        }
        case WalletTypes.NOVA: {
          if (isEvmChain()) {
            await loadMetaMaskAccounts(WalletTypes.METAMASK);
          } else {
            await loadPolkadotAccounts(WalletTypes.POLKADOT_JS);
          }
          break;
        }
      }
    },
    [loadPolkadotAccounts, loadMetaMaskAccounts],
  );

  return (
    <div className="space-y-2">
      {getWallets().map((wallet, index) => {
        const selected = wallet.extensionName === selectedWallet;
        const loading = wallet.extensionName === waitingPermissionWallet;

        if (wallet.extensionName === WalletTypes.METAMASK) {
          return (
            <MetaMaskWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                await loadWalletAccounts(wallet.extensionName);
                onSelect();
              }}
              selected={selected}
              loading={loading}
            />
          );
        }

        if (wallet.extensionName === WalletTypes.NOVA) {
          return (
            <NovaWallet
              key={index}
              wallet={wallet}
              onClick={async () => {
                await loadWalletAccounts(wallet.extensionName);
                onSelect();
              }}
              selected={selected}
              loading={loading}
            />
          );
        }

        return (
          <PolkadotWallet
            key={index}
            wallet={wallet}
            onClick={async () => {
              await loadWalletAccounts(wallet.extensionName);
              onSelect();
            }}
            selected={selected}
            loading={loading}
          />
        );
      })}
    </div>
  );
}
