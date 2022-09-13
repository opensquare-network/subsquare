import { web3FromSource } from "@polkadot/extension-dapp";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { isKeyRegisteredUser } from "..";
import { userSelector } from "../../store/reducers/userSlice";
import { CACHE_KEY } from "../constants";
import useIsMounted from "./useIsMounted";

export default function useMaybeWeb3Signer(api, setSignerAccount) {
  const user = useSelector(userSelector);
  const [isReady, setIsReady] = useState(true);
  const isKeyUser = isKeyRegisteredUser(user);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!isKeyUser) {
      return;
    }

    setIsReady(false);

    if (api) {
      const extensionName = localStorage.getItem(CACHE_KEY.lastLoginExtension);
      if (extensionName) {
        web3FromSource(extensionName).then(injector => {
          if (isMounted.current) {
            api.setSigner(injector.signer);
            setSignerAccount({
              address: user.addresses[0]?.address,
            });
            setIsReady(true);
          }
        });
      }
    }
  }, [isKeyUser, user, api, setSignerAccount, isMounted])

  return { isKeyUser, isKeyUserSignerReady: isReady };
}
