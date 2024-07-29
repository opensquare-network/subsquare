import { noop, reject } from "lodash-es";
import useInjectedWeb3 from "next-common/hooks/connect/useInjectedWeb3";
import { useGetInjectedWeb3ExtensionFn } from "next-common/hooks/connect/useInjectedWeb3Extension";
import { useChainSettings } from "next-common/context/chain";
import { useSignetAccounts } from "next-common/context/signet";
import { newWarningToast } from "next-common/store/reducers/toastSlice";
import ChainTypes from "next-common/utils/consts/chainTypes";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { normalizedSubstrateAccounts } from "next-common/utils/substrate";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useMountedState } from "react-use";
import { withTimeout } from "next-common/utils/withTimeout";
import { WALLET_TIMEOUT_ERROR_TEXT } from "next-common/utils/constants";

export function useSubstrateAccounts({
  wallet,
  onAccessGranted = noop,
  defaultLoading = false,
} = {}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const { loading: loadingWeb3 } = useInjectedWeb3();
  const getInjectedWeb3Extension = useGetInjectedWeb3ExtensionFn();
  const { chainType } = useChainSettings();
  const signetAccounts = useSignetAccounts();
  const [loading, setLoading] = useState(defaultLoading);

  const [accounts, setAccounts] = useState([]);

  const loadPolkadotAccounts = useCallback(
    async (targetWallet) => {
      setAccounts([]);

      const extension = getInjectedWeb3Extension(targetWallet?.extensionName);
      if (!extension) {
        return;
      }

      try {
        await withTimeout(async () => {
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
        }, 10000);
      } catch (e) {
        let message = e.message;

        if (e.name === "TimeoutError") {
          message = WALLET_TIMEOUT_ERROR_TEXT;
        }

        dispatch(newWarningToast(message));
      }
    },
    [
      setAccounts,
      onAccessGranted,
      isMounted,
      chainType,
      wallet,
      getInjectedWeb3Extension,
    ],
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
        case WalletTypes.POLKAGATE_SNAP:
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
          break;
        }
      }

      setLoading(false);
    },
    [loadPolkadotAccounts, loadSignetVault],
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
    loading,
  };
}
