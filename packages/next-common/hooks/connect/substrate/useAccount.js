import { noop } from "lodash-es";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useChainSettings } from "next-common/context/chain";
import { useSignetAccounts } from "next-common/context/signet";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { normalizeAddress } from "next-common/utils/address";
import ChainTypes from "next-common/utils/consts/chainTypes";
import WalletTypes from "next-common/utils/consts/walletTypes";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import isEvmChain from "next-common/utils/isEvmChain";
import {
  addNetwork,
  getChainId,
  getMetaMaskEthereum,
  normalizedMetaMaskAccounts,
  requestAccounts,
} from "next-common/utils/metamask";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function useAccount({ wallet, onAccessGranted = noop }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { injectedWeb3 } = useInjectedWeb3();
  const { chainType, ethereumNetwork } = useChainSettings();
  const signetAccounts = useSignetAccounts();

  const [addresses, setAddresses] = useState([]);

  const loadPolkadotAccounts = useCallback(
    async (selectedWallet) => {
      setAddresses([]);
      const extension = injectedWeb3?.[selectedWallet];
      if (!extension) {
        return;
      }

      try {
        const walletExtension = await extension.enable("subsquare");
        let extensionAccounts = await walletExtension.accounts?.get();
        if (chainType === ChainTypes.ETHEREUM) {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type === ChainTypes.ETHEREUM,
          );
        } else if (
          !(
            ChainTypes.MIXED === chainType &&
            selectedWallet === WalletTypes.TALISMAN
          )
        ) {
          extensionAccounts = extensionAccounts.filter(
            (acc) => acc.type !== ChainTypes.ETHEREUM,
          );
        }

        if (isMounted.current) {
          setAddresses(
            extensionAccounts.map((item) => ({
              ...item,
              address: normalizeAddress(item.address),
            })),
          );
        }

        onAccessGranted && onAccessGranted();
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [injectedWeb3, setAddresses, onAccessGranted, isMounted, chainType],
  );

  const loadMetaMaskAccounts = useCallback(async () => {
    const ethereum = getMetaMaskEthereum();
    if (!ethereum) {
      dispatch(newErrorToast("Please install MetaMask"));
      return;
    }

    try {
      const chainId = await getChainId();
      if (chainId !== ethereumNetwork.chainId) {
        await addNetwork(ethereum, ethereumNetwork);
      }

      const accounts = await requestAccounts();
      if (isMounted.current) {
        setAddresses(normalizedMetaMaskAccounts(accounts));
      }
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [dispatch, isMounted, setAddresses, ethereumNetwork]);

  const loadSignetVault = useCallback(() => {
    setAddresses(signetAccounts);
  }, [signetAccounts, setAddresses]);

  const loadWalletAccounts = useCallback(
    async (wallet) => {
      if (!wallet) {
        return;
      }

      switch (wallet) {
        case WalletTypes.POLKADOT_JS:
        case WalletTypes.POLKAGATE:
        case WalletTypes.SUBWALLET_JS:
        case WalletTypes.TALISMAN:
        case WalletTypes.MIMIR: {
          await loadPolkadotAccounts(wallet);
          break;
        }
        case WalletTypes.SIGNET: {
          await loadSignetVault();
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
    [loadPolkadotAccounts, loadMetaMaskAccounts, loadSignetVault],
  );

  useEffect(() => {
    loadWalletAccounts(wallet);
  }, [wallet]);

  return {
    addresses,
  };
}
