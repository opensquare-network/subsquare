import { useEffect, useState } from "react";
import { isSameAddress } from "..";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useUser } from "../../context/user";
import useApi from "./useApi";
import WalletTypes from "../consts/walletTypes";
import { useConnectedWallet } from "next-common/context/connectedWallet";
import { CACHE_KEY } from "../constants";

export default function useSignerAccount(extensionAccounts) {
  const { injectedWeb3 } = useInjectedWeb3();
  const [signerAccount, setSignerAccount] = useState();
  const api = useApi();
  const user = useUser();
  const connectedWallet = useConnectedWallet();
  const userAddress = user?.address;
  const proxyAddress = user?.proxyAddress;
  const extensionName = localStorage.getItem(CACHE_KEY.lastLoginExtension);

  useEffect(() => {
    if (!userAddress && !connectedWallet) {
      return;
    }

    let account = null;
    let isLoggedInAddress = false;

    // Check user login address first
    if (userAddress) {
      account = extensionAccounts?.find(
        (item) =>
          isSameAddress(item.address, userAddress) &&
          item.meta?.source === extensionName,
      );
      if (account) {
        isLoggedInAddress = true;
      }
    }

    // Check connected wallet address
    if (!account && connectedWallet) {
      account = extensionAccounts?.find(
        (item) =>
          isSameAddress(item.address, connectedWallet) &&
          item.meta?.source === extensionName,
      );
      if (account) {
        isLoggedInAddress = false;
      }
    }

    if (account) {
      if (account.meta?.source !== WalletTypes.METAMASK) {
        if (!injectedWeb3) {
          return;
        }
        const extension = injectedWeb3?.[extensionName];
        if (!extension) {
          return;
        }
        extension.enable("subsquare").then((wallet) => {
          if (wallet) {
            api?.setSigner(wallet.signer);
          }
        });
      }

      setSignerAccount({
        ...account,
        name: account.meta?.name,
        proxyAddress,
        realAddress: isLoggedInAddress
          ? proxyAddress || userAddress
          : connectedWallet,
        isLoggedInAddress,
      });
    } else {
      setSignerAccount();
    }
  }, [
    extensionAccounts,
    userAddress,
    connectedWallet,
    proxyAddress,
    api,
    injectedWeb3,
    extensionName,
  ]);

  return signerAccount;
}
