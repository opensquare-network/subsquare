import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { stringToHex } from "@polkadot/util";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { loginRedirectUrlSelector } from "next-common/store/reducers/userSlice";
import { encodeAddressToChain } from "next-common/services/address";
import {
  useSetUser,
  useIsLoggedIn,
  fetchAndUpdateUserStatus,
  useUserContext,
} from "next-common/context/user";
import { useConnectedAccountContext } from "next-common/context/connectedAccount";
import { useChain } from "next-common/context/chain";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";

export function useEnsureLogin() {
  const chain = useChain();
  const setUser = useSetUser();
  const userContext = useUserContext();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { connectedAccount } = useConnectedAccountContext();
  const { injectedWeb3 } = useInjectedWeb3();
  const redirectUrl = useSelector(loginRedirectUrlSelector);

  const signWith = useCallback(
    async (message, address, walletName) => {
      if (walletName === WalletTypes.METAMASK) {
        return await personalSign(stringToHex(message), address);
      }

      const extension = injectedWeb3?.[walletName];
      if (!extension) {
        return;
      }

      const wallet = await extension.enable("subsquare");
      const { signature } = await wallet.signer.signRaw({
        type: "bytes",
        data: stringToHex(message),
        address,
      });

      return signature;
    },
    [injectedWeb3],
  );

  const login = useCallback(async () => {
    if (!connectedAccount) {
      dispatch(newErrorToast("Connected wallet is not found."));
      return false;
    }

    setLoading(true);
    try {
      const address = encodeAddressToChain(connectedAccount.address, chain);

      const { result, error } = await nextApi.fetch(`auth/login/${address}`);

      if (error) {
        dispatch(newErrorToast(error.message));
        return false;
      }

      let challengeAnswer;
      try {
        challengeAnswer = await signWith(
          result?.challenge,
          connectedAccount.address,
          connectedAccount.wallet,
        );
      } catch (e) {
        if (e.message !== "Cancelled") {
          dispatch(newErrorToast(e.message));
        }
        return false;
      }

      try {
        const { result: loginResult, error: loginError } = await nextApi.post(
          `auth/login/${result?.attemptId}`,
          { challengeAnswer, signer: connectedAccount.wallet },
        );
        if (loginResult) {
          setUser(loginResult);
          fetchAndUpdateUserStatus(userContext);
          if (redirectUrl) {
            router.push(redirectUrl);
          }

          return true;
        } else if (loginError) {
          dispatch(newErrorToast(loginError.message));
          return false;
        }
      } catch (e) {
        dispatch(newErrorToast(e.message));
        return false;
      }
    } finally {
      setLoading(false);
    }
  }, [
    signWith,
    connectedAccount,
    chain,
    dispatch,
    setUser,
    router,
    redirectUrl,
  ]);

  const ensureLogin = useCallback(async () => {
    if (isLoggedIn) {
      // Already login
      return true;
    }
    return await login();
  }, [isLoggedIn, login]);

  return {
    login,
    ensureLogin,
    loading,
  };
}
