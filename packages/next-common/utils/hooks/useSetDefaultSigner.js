import { useEffect } from "react";
import { useSelector } from "react-redux";
import { encodeAddress } from "@polkadot/util-crypto";
import { isKeyRegisteredUser } from "..";
import { userSelector } from "../../store/reducers/userSlice";
import { CACHE_KEY } from "../constants";

export default function useSetDefaultSigner(
  extensionAccounts,
  setSignerAccount
) {
  const user = useSelector(userSelector);
  const isKeyUser = isKeyRegisteredUser(user);
  const address = user?.addresses?.[0]?.address;

  useEffect(() => {
    if (!address) {
      return;
    }

    let account = null;
    if (isKeyUser) {
      const extensionName = localStorage.getItem(CACHE_KEY.lastLoginExtension);
      account = extensionAccounts.find(
        (item) =>
          item.address === encodeAddress(address, 42) &&
          item.meta?.source === extensionName
      );
    } else {
      account = extensionAccounts.find(
        (item) => item.address === encodeAddress(address, 42)
      );
    }

    if (!account) {
      return;
    }
    setSignerAccount({
      ...account,
      name: account.meta?.name,
    });
  }, [extensionAccounts, address, setSignerAccount]);
}
