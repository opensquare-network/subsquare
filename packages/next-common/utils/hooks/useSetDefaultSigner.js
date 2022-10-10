import { useEffect } from "react";
import { isKeyRegisteredUser, isSameAddress } from "..";
import { CACHE_KEY } from "../constants";
import { useUser } from "../../context/user";

export default function useSetDefaultSigner(
  extensionAccounts,
  setSignerAccount
) {
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
      setSignerAccount({
        ...account,
        name: account.meta?.name,
      });
    }
  }, [extensionAccounts, address, setSignerAccount]);
}
