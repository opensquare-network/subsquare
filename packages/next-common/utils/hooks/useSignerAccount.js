import { useEffect, useState } from "react";
import { isSameAddress } from "..";
import { CACHE_KEY } from "../constants";
import { useUser } from "../../context/user";
import useApi from "./useApi";

export default function useSignerAccount(extensionAccounts) {
  const [signerAccount, setSignerAccount] = useState();
  const api = useApi();
  const user = useUser();
  const address = user?.address;
  const proxyAddress = user?.proxyAddress;

  useEffect(() => {
    if (!address) {
      return;
    }

    const extensionName = localStorage.getItem(CACHE_KEY.lastLoginExtension);
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
      import("@polkadot/extension-dapp").then(({ web3FromSource }) => {
        web3FromSource(account.meta?.source).then((injector) => {
          api?.setSigner(injector.signer);
        });
      });

      setSignerAccount({
        ...account,
        name: account.meta?.name,
        proxyAddress,
        realAddress: proxyAddress || address,
      });
    } else {
      setSignerAccount();
    }
  }, [extensionAccounts, address, proxyAddress, api]);

  return signerAccount;
}
