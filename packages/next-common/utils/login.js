import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import nextApi from "../../services/nextApi";
import { newErrorToast } from "../../store/reducers/toastSlice";
import { encodeAddressToChain } from "../../services/address";
import { stringToHex } from "@polkadot/util";
import { updateUser, useUserDispatch } from "../../context/user";
import { useChain } from "../../context/chain";
import { personalSign } from "next-common/utils/metamask";
import WalletTypes from "next-common/utils/consts/walletTypes";
import { useConnectedWalletContext } from "next-common/context/connectedWallet";
import useInjectedWeb3 from "next-common/components/wallet/useInjectedWeb3";

export function useEnsureConnectedWalletLoggedIn() {
  const chain = useChain();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const { connectedWallet } = useConnectedWalletContext();
  const { injectedWeb3 } = useInjectedWeb3();

  const signWith = useCallback(
    async (message, address, walletName) => {
      if (walletName === WalletTypes.METAMASK) {
        return await personalSign(stringToHex(message), address);
      }

      const wallet = injectedWeb3.find((w) => w.name === walletName);
      if (!wallet) {
        return;
      }

      const { signature } = await wallet.signer.signRaw({
        type: "bytes",
        data: stringToHex(message),
        address,
      });

      return signature;
    },
    [injectedWeb3],
  );

  const doLogin = useCallback(async () => {
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
  }, [signWith, connectedWallet, chain, dispatch, userDispatch]);

  return {
    doLogin,
    loading,
  };
}
