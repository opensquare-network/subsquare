import { useEffect, useState } from "react";
import { isSameAddress } from "..";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useUser } from "../../context/user";
import useApi from "./useApi";
import WalletTypes from "../consts/walletTypes";
import { useConnectedAddress } from "next-common/context/connectedAddress";

export default function useSignerAccount(extensionAccounts) {
  const { injectedWeb3 } = useInjectedWeb3();
  const [signerAccount, setSignerAccount] = useState();
  const api = useApi();
  const user = useUser();
  const connectedAddress = useConnectedAddress();
  const userAddress = user?.address;
  const proxyAddress = user?.proxyAddress;

  useEffect(() => {
    if (!userAddress && !connectedAddress) {
      return;
    }

    let account = null;
    let isLoggedInAddress = false;

    // Check user login address first
    if (userAddress) {
      account = extensionAccounts?.find(
        (item) =>
          isSameAddress(item.address, userAddress) &&
          item.meta?.source === connectedAddress?.extensionName,
      );
      if (account) {
        isLoggedInAddress = true;
      }
    }

    // Check connected wallet address
    if (!account && connectedAddress) {
      account = extensionAccounts?.find(
        (item) =>
          isSameAddress(item.address, connectedAddress?.address) &&
          item.meta?.source === connectedAddress?.extensionName,
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
        const extension = injectedWeb3?.[connectedAddress?.extensionName];
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
          : connectedAddress?.address,
        isLoggedInAddress,
      });
    } else {
      setSignerAccount();
    }
  }, [
    extensionAccounts,
    userAddress,
    connectedAddress,
    proxyAddress,
    api,
    injectedWeb3,
  ]);

  return signerAccount;
}
