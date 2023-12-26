import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import nextApi from "next-common/services/nextApi";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { encodeAddressToChain } from "next-common/services/address";
import { stringToHex } from "@polkadot/util";
import { updateUser, useUser, useUserDispatch } from "next-common/context/user";
import { useChain } from "next-common/context/chain";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";
import { CACHE_KEY } from "./constants";
import { useCookieValue } from "./hooks/useCookieValue";
import { loginRedirectUrlSelector } from "next-common/store/reducers/userSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useLoginPopup } from "next-common/hooks/useLoginPopup";

export function useEnsureConnectedWalletLoggedIn() {
  const chain = useChain();
  const loginUser = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const { connectedWallet } = useConnectedWalletContext();
  const { injectedWeb3 } = useInjectedWeb3();
  const [dontRemindEmail] = useCookieValue(CACHE_KEY.dontRemindEmail);
  const redirectUrl = useSelector(loginRedirectUrlSelector);
  const isLoginPage = router.pathname === "/login";
  const { openLoginPopup } = useLoginPopup();

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
    setLoading(true);
    try {
      const address = encodeAddressToChain(connectedWallet.address, chain);

      const { result, error } = await nextApi.fetch(`auth/login/${address}`);

      if (error) {
        dispatch(newErrorToast(error.message));
      }

      if (!result?.challenge) {
        return;
      }

      let challengeAnswer;
      try {
        challengeAnswer = await signWith(
          result.challenge,
          connectedWallet.address,
          connectedWallet.wallet,
        );
      } catch (e) {
        if (e.message !== "Cancelled") {
          dispatch(newErrorToast(e.message));
        }
        return;
      }

      try {
        const { result: loginResult, error: loginError } = await nextApi.post(
          `auth/login/${result?.attemptId}`,
          { challengeAnswer, signer: connectedWallet.wallet },
        );
        if (loginResult) {
          updateUser(loginResult, userDispatch);

          if (redirectUrl) {
            router.push(redirectUrl);
          }

          if (!loginResult.email && !dontRemindEmail) {
            openLoginPopup({ initView: "email" });
          }
        }

        if (loginError) {
          dispatch(newErrorToast(loginError.message));
        }
      } catch (e) {
        dispatch(newErrorToast(e.message));
      }
    } finally {
      setLoading(false);
    }
  }, [
    signWith,
    connectedWallet,
    chain,
    dispatch,
    userDispatch,
    openLoginPopup,
    router,
    isLoginPage,
    dontRemindEmail,
    redirectUrl,
  ]);

  const ensureLogin = useCallback(async () => {
    if (loginUser) {
      // Already logged
      return true;
    }
    try {
      await login();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return true;
    }

    return false;
  }, [dispatch, loginUser, login]);

  return {
    login,
    ensureLogin,
    loading,
  };
}
