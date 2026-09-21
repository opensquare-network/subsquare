import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { noop } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { wrapTransaction } from "next-common/utils/sendTransaction";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import { useMaybeMultisigCallback } from "./useMaybeMultisigCallback";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

export default function useTxSubmission({
  api,
  getTxFunc = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onCancelled = noop,
  onTxError = noop,
  onTxStart = noop,
}) {
  const dispatch = useDispatch();
  const defaultApi = useContextApi();
  const apiToUse = api || defaultApi;
  const signerAccount = useSignerAccount();
  const isWatchOnly = useIsWatchOnly();
  const { sendTxFunc, isSubmitting } = useSendTransaction();
  const {
    onInBlock: maybeMultisigOnInBlock,
    onFinalized: maybeMultisigOnFinalized,
  } = useMaybeMultisigCallback({ onInBlock, onFinalized });
  const [isWrapping, setIsWrapping] = useState(false);

  const getTx = useCallback(
    async (...args) => {
      let tx = null;
      try {
        tx = await getTxFunc(...args);
      } catch (e) {
        dispatch(newErrorToast(e.message));
        return;
      }

      if (!tx) {
        return;
      }

      tx = await wrapTransaction(apiToUse, tx, signerAccount);
      return tx;
    },
    [getTxFunc, apiToUse, signerAccount, dispatch],
  );

  const doSubmit = useCallback(
    async (...args) => {
      if (isWatchOnly) {
        dispatch(newErrorToast(WATCH_ONLY_TOOLTIP_TEXT));
        return;
      }

      if (!apiToUse) {
        dispatch(newErrorToast("Chain RPC is not connected yet"));
        return;
      }

      if (!signerAccount) {
        dispatch(newErrorToast("Signer account is not specified"));
        return;
      }

      setIsWrapping(true);
      let tx;
      try {
        tx = await getTx(...args);
      } finally {
        setIsWrapping(false);
      }

      if (!tx) {
        return;
      }

      await sendTxFunc({
        api: apiToUse,
        tx,
        onTxStart,
        onSubmitted,
        onInBlock: maybeMultisigOnInBlock,
        onFinalized: maybeMultisigOnFinalized,
        onCancelled,
        onTxError,
      });
    },
    [
      apiToUse,
      dispatch,
      isWatchOnly,
      signerAccount,
      getTx,
      sendTxFunc,
      onTxStart,
      onSubmitted,
      maybeMultisigOnInBlock,
      maybeMultisigOnFinalized,
      onCancelled,
      onTxError,
    ],
  );

  return {
    isWrapping,
    isSubmitting,
    doSubmit,
  };
}
