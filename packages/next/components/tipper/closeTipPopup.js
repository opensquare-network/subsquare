import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import MaybeLoginWithAction from "next-common/components/maybeLoginWithAction";
import { getSigner, sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useUser } from "next-common/context/user";

export default function CloseTipPopup({
  tipHash,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const api = useApi();
  const loginUser = useUser();
  const proxyAddress = loginUser?.proxyAddress;

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch]
  );

  const doCloseTip = useCallback(async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!loginUser) {
      return showErrorToast("Please login first");
    }

    const signerAddress = loginUser.address;

    try {
      const signer = await getSigner(signerAddress);
      api.setSigner(signer);
    } catch (e) {
      return showErrorToast(`Unable to find injected ${signerAddress}`);
    }

    let tx = api.tx.tips.closeTip(tipHash);
    if (proxyAddress) {
      tx = wrapWithProxy(api, tx, proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  }, [
    api,
    dispatch,
    isMounted,
    showErrorToast,
    loginUser,
    onFinalized,
    onInBlock,
    onSubmitted,
    onClose,
    tipHash,
  ]);

  return <MaybeLoginWithAction actionCallback={doCloseTip} onClose={onClose} />;
}
