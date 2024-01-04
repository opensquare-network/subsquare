import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { LoginResult } from "next-common/store/reducers/userSlice";
import { encodeAddressToChain } from "next-common/services/address";
import {
  useSetUser,
  useIsLoggedIn,
  fetchAndUpdateUserStatus,
  useUserContext,
  useUser,
} from "next-common/context/user";
import { useChain } from "next-common/context/chain";
import { useLoginPopup } from "./useLoginPopup";
import { getCookieConnectedAccount } from "next-common/utils/getCookieConnectedAccount";
import { useSignMessage } from "./useSignMessage";

export function useEnsureLogin() {
  const chain = useChain();
  const user = useUser();
  const setUser = useSetUser();
  const userContext = useUserContext();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { openLoginPopup, waitForClose } = useLoginPopup();
  const signMsg = useSignMessage();

  const login = useCallback(async () => {
    const connectedAccount = getCookieConnectedAccount();

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
        challengeAnswer = await signMsg(
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
          await fetchAndUpdateUserStatus(userContext);
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
  }, [signMsg, chain, dispatch, setUser, router]);

  const ensureLogin = useCallback(async () => {
    if (isLoggedIn) {
      // Already login
      return true;
    }

    if (user) {
      // Not login yet
      return await login();
    }

    // Not connect yet
    openLoginPopup();
    const loginResult = await waitForClose();
    if (loginResult === LoginResult.Connected) {
      return await login();
    } else if (loginResult === LoginResult.LoggedIn) {
      return true;
    }

    return false;
  }, [user, isLoggedIn, login, openLoginPopup, waitForClose]);

  return {
    login,
    ensureLogin,
    loading,
  };
}
