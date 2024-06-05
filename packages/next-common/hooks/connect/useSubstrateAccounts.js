import { noop, reject } from "lodash-es";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useChainSettings } from "next-common/context/chain";
import { useSignetAccounts } from "next-common/context/signet";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { normalizeAddress } from "next-common/utils/address";
import ChainTypes from "next-common/utils/consts/chainTypes";
import WalletTypes from "next-common/utils/consts/walletTypes";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function useSubstrateAccounts({ wallet, onAccessGranted = noop } = {}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { injectedWeb3, loading } = useInjectedWeb3();
  const { chainType } = useChainSettings();
  const signetAccounts = useSignetAccounts();

  const [accounts, setAccounts] = useState([]);

  const loadInjectedAccounts = useCallback(async () => {
    const { web3Enable, web3Accounts } = await import(
      "@polkadot/extension-dapp"
    );

    try {
      await web3Enable("subsquare");
      const injectedAccounts = reject(await web3Accounts(), {
        type: ChainTypes.ETHEREUM,
      });

      if (isMounted.current) {
        setAccounts(
          injectedAccounts.map((item) => ({
            ...item,
            address: normalizeAddress(item.address),
          })),
        );
      }
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [isMounted, dispatch]);

  const loadPolkadotAccounts = useCallback(
    async (selectedWalletName) => {
      setAccounts([]);

      const extension = injectedWeb3?.[selectedWalletName];
      if (!extension) {
        return;
      }

      try {
        const walletExtension = await extension.enable("subsquare");
        const extensionAccounts = reject(
          await walletExtension.accounts?.get(),
          { type: ChainTypes.ETHEREUM },
        );

        if (isMounted.current) {
          setAccounts(
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
    [injectedWeb3, setAccounts, onAccessGranted, isMounted, chainType],
  );

  const loadSignetVault = useCallback(() => {
    setAccounts(signetAccounts);
  }, [signetAccounts, setAccounts]);

  const loadWalletAccounts = useCallback(
    async (selectedWalletName) => {
      switch (selectedWalletName) {
        case WalletTypes.POLKADOT_JS:
        case WalletTypes.POLKAGATE:
        case WalletTypes.SUBWALLET_JS:
        case WalletTypes.TALISMAN:
        case WalletTypes.MIMIR: {
          await loadPolkadotAccounts(selectedWalletName);
          break;
        }
        case WalletTypes.SIGNET: {
          await loadSignetVault();
          break;
        }
        case WalletTypes.NOVA: {
          await loadPolkadotAccounts(WalletTypes.POLKADOT_JS);
          break;
        }
        default: {
          await loadInjectedAccounts();
          break;
        }
      }
    },
    [loadInjectedAccounts, loadPolkadotAccounts, loadSignetVault],
  );

  useEffect(() => {
    loadWalletAccounts(wallet?.extensionName);
  }, [wallet?.extensionName]);

  return { accounts, loading };
}
