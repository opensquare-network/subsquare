import { noop, reject } from "lodash-es";
import { useGetInjectedWeb3ExtensionFn } from "next-common/components/wallet/useInjectedWeb3Extension";
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
      loadWalletAccounts(wallet);
    }
  }, [wallet, isMounted]);

  return {
    accounts,
    loading,
  };
}
