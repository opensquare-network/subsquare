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

export function useAccounts({ wallet, onAccessGranted = noop }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { injectedWeb3 } = useInjectedWeb3();
  const { chainType } = useChainSettings();
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
        const extensionAccounts = reject(
          await walletExtension.accounts?.get(),
          { type: ChainTypes.ETHEREUM },
        );

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
        case WalletTypes.SUBWALLET:
        case WalletTypes.TALISMAN:
        case WalletTypes.MIMIR: {
          await loadPolkadotAccounts(wallet);
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
      }
    },
    [loadPolkadotAccounts, loadSignetVault],
  );

  useEffect(() => {
    loadWalletAccounts(wallet);
  }, [wallet]);

  return addresses;
}
