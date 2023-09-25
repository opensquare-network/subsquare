import { useCallback, useEffect, useState } from "react";
import { isSameAddress } from "..";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useUser } from "../../context/user";
import useApi from "./useApi";
import WalletTypes from "../consts/walletTypes";
import { useConnectedAddress } from "next-common/context/connectedAddress";

function useSetSigner() {
  const api = useApi();
  const { injectedWeb3 } = useInjectedWeb3();

  return useCallback(
    (account) => {
      if (!account) {
        return;
      }

      if (account.meta?.source !== WalletTypes.METAMASK) {
        if (!injectedWeb3) {
          return;
        }
        const extension = injectedWeb3?.[account.meta?.source];
        if (!extension) {
          return;
        }
        extension.enable("subsquare").then((wallet) => {
          if (wallet) {
            api?.setSigner(wallet.signer);
          }
        });
      }
    },
    [injectedWeb3, api],
  );
}

export default function useSignerAccount(extensionAccounts) {
  const [signerAccount, setSignerAccount] = useState();
  const user = useUser();
  const connectedAddress = useConnectedAddress();
  const userAddress = user?.address;
  const proxyAddress = user?.proxyAddress;
  const setSigner = useSetSigner();

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
          item.meta?.source === connectedAddress?.wallet,
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
          item.meta?.source === connectedAddress?.wallet,
      );
      if (account) {
        isLoggedInAddress = false;
      }
    }

    if (!account) {
      setSignerAccount();
      return;
    }

    setSigner(account);

    setSignerAccount({
      ...account,
      name: account.meta?.name,
      proxyAddress,
      realAddress: isLoggedInAddress
        ? proxyAddress || userAddress
        : connectedAddress?.address,
      isLoggedInAddress,
    });
  }, [
    extensionAccounts,
    userAddress,
    connectedAddress,
    proxyAddress,
    setSigner,
  ]);

  return signerAccount;
}
