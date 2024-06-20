import { noop, reject } from "lodash-es";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useChainSettings } from "next-common/context/chain";
import { useSignetAccounts } from "next-common/context/signet";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import ChainTypes from "next-common/utils/consts/chainTypes";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { normalizedSubstrateAccounts } from "next-common/utils/substrate";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMountedState } from "react-use";

export function useSubstrateAccounts({
  wallet,
  onAccessGranted = noop,
  defaultLoading = true,
} = {}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const { injectedWeb3, loading: loadingWeb3 } = useInjectedWeb3();
  const { chainType } = useChainSettings();
  const signetAccounts = useSignetAccounts();
  const [loading, setLoading] = useState(defaultLoading);

  const [accounts, setAccounts] = useState([]);

  const loadInjectedAccounts = useCallback(
    async (targetWallet) => {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );

      try {
        await web3Enable("subsquare");
        const injectedAccounts = reject(await web3Accounts(), {
          type: ChainTypes.ETHEREUM,
        });

        if (isMounted()) {
          setAccounts(
            normalizedSubstrateAccounts(
              injectedAccounts,
              targetWallet?.extensionName,
            ),
          );
        }
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [isMounted, dispatch],
  );

  const loadPolkadotAccounts = useCallback(
    async (targetWallet) => {
      setAccounts([]);

      let extension;
      if (targetWallet.extensionName === WalletTypes.NOVA) {
        extension = injectedWeb3?.[WalletTypes.POLKADOT_JS];
      } else {
        extension = injectedWeb3?.[targetWallet?.extensionName];
      }
      if (!extension) {
        return;
      }

      try {
        const walletExtension = await extension.enable("subsquare");
        const extensionAccounts = reject(
          await walletExtension.accounts?.get(),
          { type: ChainTypes.ETHEREUM },
        );

        if (isMounted()) {
          setAccounts(
            normalizedSubstrateAccounts(
              extensionAccounts,
              targetWallet?.extensionName,
            ),
          );
        }

        onAccessGranted && onAccessGranted();
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    },
    [injectedWeb3, setAccounts, onAccessGranted, isMounted, chainType, wallet],
  );

  const loadSignetVault = useCallback(() => {
    setAccounts(signetAccounts);
  }, [signetAccounts, setAccounts]);

  const loadWalletAccounts = useCallback(
    async (wallet) => {
      setLoading(true);

      switch (wallet?.extensionName) {
        case WalletTypes.POLKADOT_JS:
        case WalletTypes.POLKAGATE:
        case WalletTypes.SUBWALLET_JS:
        case WalletTypes.TALISMAN:
        case WalletTypes.MIMIR:
        case WalletTypes.NOVA: {
          await loadPolkadotAccounts(wallet);
          break;
        }
        case WalletTypes.SIGNET: {
          await loadSignetVault();
          break;
        }
        default: {
          await loadInjectedAccounts(wallet);
          break;
        }
      }

      setLoading(false);
    },
    [loadInjectedAccounts, loadPolkadotAccounts, loadSignetVault],
  );

  useEffect(() => {
    if (isMounted()) {
      if (!loadingWeb3) {
        loadWalletAccounts(wallet);
      }
    }
  }, [wallet, isMounted, loadingWeb3]);

  return {
    accounts,
    loading: loadingWeb3 || loading,
  };
}
