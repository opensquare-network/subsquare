import { useEffect } from "react";
import { isKeyRegisteredUser, isSameAddress } from "..";
import { CACHE_KEY } from "../constants";
import { useUser } from "../../context/user";
import useApi from "./useApi";

export default function useSetSignerAccount(
  extensionAccounts,
  setSignerAccount
) {
  const api = useApi();
  const user = useUser();
  const isKeyUser = isKeyRegisteredUser(user);
  const address = user?.address;

  useEffect(() => {
    if (!address) {
      return;
    }

    let account = extensionAccounts.find((item) =>
      isSameAddress(item.address, address)
    );

    if (isKeyUser) {
      const extensionName = localStorage.getItem(CACHE_KEY.lastLoginExtension);
      account = extensionAccounts.find(
        (item) =>
          isSameAddress(item.address, address) &&
          item.meta?.source === extensionName
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
      });
    }
  }, [extensionAccounts, address, setSignerAccount, api]);
}
