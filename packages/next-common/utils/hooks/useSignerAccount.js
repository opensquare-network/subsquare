import { useEffect, useState } from "react";
import { isSameAddress } from "..";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { useUser } from "../../context/user";
import useApi from "./useApi";
import WalletTypes from "../consts/walletTypes";
import { useConnectedWallet } from "next-common/context/connectedWallet";

export default function useSignerAccount(extensionAccounts) {
  const { injectedWeb3 } = useInjectedWeb3();
  const [signerAccount, setSignerAccount] = useState();
  const api = useApi();
  const user = useUser();
  const connectedWallet = useConnectedWallet();
  const address = user?.address || connectedWallet;
  const proxyAddress = user?.proxyAddress;

  useEffect(() => {
    if (!address) {
      return;
    }

    const extensionName = localStorage.lastLoginExtension;

    let account = extensionAccounts?.find(
      (item) =>
        isSameAddress(item.address, address) &&
        item.meta?.source === extensionName,
    );
    if (!account) {
      account = extensionAccounts?.find((item) =>
        isSameAddress(item.address, address),
      );
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
        realAddress: proxyAddress || address,
      });
    } else {
      setSignerAccount();
    }
  }, [extensionAccounts, address, proxyAddress, api, injectedWeb3]);

  return signerAccount;
}
