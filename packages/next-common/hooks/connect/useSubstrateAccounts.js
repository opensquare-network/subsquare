import { noop } from "lodash-es";
import useInjectedWeb3 from "next-common/hooks/connect/useInjectedWeb3";
import { findInjectedExtension } from "next-common/hooks/connect/useInjectedWeb3Extension";
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
import { useChainSettings } from "next-common/context/chain";

export function useSubstrateAccounts({
  wallet,
  onAccessGranted = noop,
  defaultLoading = false,
} = {}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const { chainType } = useChainSettings();
  const { injectedWeb3, loading: loadingWeb3 } = useInjectedWeb3();
  const signetAccounts = useSignetAccounts();
  const [loading, setLoading] = useState(defaultLoading);

  const [accounts, setAccounts] = useState([]);

  const loadPolkadotAccounts = useCallback(
    async (targetWallet) => {
      setAccounts([]);

      const extension = findInjectedExtension(
        targetWallet?.extensionName,
        injectedWeb3,
      );
      if (!extension) {
        return;
      }

      try {
        await withTimeout(async () => {
          const walletExtension = await extension.enable("subsquare");
          const allAccounts = await walletExtension.accounts?.get();

          let filter = (item) => item.type !== "ethereum";
          if (chainType === ChainTypes.ETHEREUM) {
            filter = (item) => item.type === "ethereum";
          } else if (ChainTypes.MIXED === chainType) {
            filter = () => true;
          }

          const extensionAccounts = (allAccounts || []).filter(filter);

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
    [injectedWeb3, isMounted, onAccessGranted, dispatch, chainType],
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
  }, [wallet, isMounted, loadingWeb3, loadWalletAccounts]);

  return {
    accounts,
    loading,
  };
}
