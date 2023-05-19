import React, { useEffect, useState, useCallback } from "react";
import { getWallets } from "../../utils/consts/connect";
import styled from "styled-components";
import useIsMounted from "../../utils/hooks/useIsMounted";
import { emptyFunction } from "../../utils";
import { useDispatch } from "react-redux";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import useInjectedWeb3 from "./useInjectedWeb3";
import PolkadotWallet from "./polkadotWallet";
import { MetaMaskWallet } from "./metamaskWallet";
import {
  addNetwork,
  getChainId,
  getMetaMaskEthereum,
  normalizedMetaMaskAccounts,
  requestAccounts,
  useMetaMaskAccounts,
} from "next-common/utils/metamask";

const WalletOptions = styled.ul`
  all: unset;

  li:first-child {
    margin-top: 24px;
  }

  li:not(:first-child) {
    margin-top: 8px;
  }
`;

export default function SelectWallet({
  selectedWallet,
  setSelectWallet,
  setAccounts,
  setWallet = emptyFunction,
  onSelect = emptyFunction,
  onAccessGranted = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [waitingPermissionWallet, setWaitingPermissionWallet] = useState(null);
  const { injectedWeb3 } = useInjectedWeb3();
  const { chainType, ethereumNetwork } = useChainSettings();
  const chain = useChain();
  const metamaskAccounts = useMetaMaskAccounts();

  useEffect(() => {
    if (selectedWallet === "metamask") {
      setAccounts(metamaskAccounts);
    }
  }, [metamaskAccounts, selectedWallet, setAccounts]);

  useEffect(() => {
    if (!injectedWeb3) {
      return;
    }

    for (let wallet of getWallets()) {
      if (injectedWeb3[wallet.extensionName]) {
        return;
      }
    }

    if (chain === Chains.darwinia2) {
      // For Darwinia2, we only due with the known supported wallets
      return;
    }

    // For unknown wallet extensions
    (async () => {
      const polkadotDapp = await import("@polkadot/extension-dapp");
      const extensionUtils = await import("../../utils/extensionAccount");
      const web3Enable = polkadotDapp.web3Enable;
      const web3FromSource = polkadotDapp.web3FromSource;
      const polkadotWeb3Accounts = extensionUtils.polkadotWeb3Accounts;

      await web3Enable("subsquare");
      const extensionAccounts = await polkadotWeb3Accounts(chainType);
      const accounts = extensionAccounts.map((item) => {
        return {
          ...item,
          name: item.meta?.name,
        };
      });

      if (isMounted.current) {
        setAccounts(accounts);
        if (accounts?.length > 0) {
          const injector = await web3FromSource(accounts[0].meta.source);
          setSelectWallet("other");
          setWallet(injector);
        }
      }
    })();
  }, [
    injectedWeb3,
    setAccounts,
    setSelectWallet,
    setWallet,
    isMounted,
    chainType,
    chain,
  ]);

  const loadAccounts = useCallback(
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
        if (chainType === "ethereum") {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type === "ethereum",
          );
        } else {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type !== "ethereum",
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

  const onPolkadotWalletClick = useCallback(
    (wallet) => {
      loadAccounts(wallet.extensionName);
      onSelect && onSelect(wallet.extensionName);
    },
    [loadAccounts, onSelect],
  );

  const onMetaMaskWalletClick = useCallback(
    (wallet) => {
      loadMetaMaskAccounts(wallet.extensionName);
      onSelect && onSelect(wallet.extensionName);
    },
    [loadMetaMaskAccounts, onSelect],
  );

  return (
    <WalletOptions>
      {getWallets().map((wallet, index) => {
        if (wallet.extensionName === "metamask") {
          return (
            <MetaMaskWallet
              key={index}
              wallet={wallet}
              onClick={onMetaMaskWalletClick}
              selected={wallet.extensionName === selectedWallet}
              loading={wallet.extensionName === waitingPermissionWallet}
            />
          );
        }

        return (
          <PolkadotWallet
            key={index}
            wallet={wallet}
            onClick={onPolkadotWalletClick}
            selected={wallet.extensionName === selectedWallet}
            loading={wallet.extensionName === waitingPermissionWallet}
          />
        );
      })}
    </WalletOptions>
  );
}
