import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { noop } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { wrapTransaction } from "next-common/utils/sendTransaction";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import { useMaybeMultisigCallback } from "./useMaybeMultisigCallback";

export default function useTxSubmission({
  getTxFunc = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onCancelled = noop,
  onTxError = noop,
}) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { sendTxFunc, isSubmitting } = useSendTransaction();
  const {
    onInBlock: maybeMultisigOnInBlock,
    onFinalized: maybeMultisigOnFinalized,
  } = useMaybeMultisigCallback({ onInBlock, onFinalized });

  const doSubmit = useCallback(async () => {
    if (!api) {
      dispatch(newErrorToast("Chain RPC is not connected yet"));
      return;
    }

    if (!signerAccount) {
      dispatch(newErrorToast("Signer account is not specified"));
      return;
    }

    let tx = null;
    try {
      tx = await getTxFunc();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    if (!tx) {
      return;
    }

    tx = await wrapTransaction(api, tx, signerAccount);

    await sendTxFunc({
      api,
      tx,
      onSubmitted,
      onInBlock: maybeMultisigOnInBlock,
      onFinalized: maybeMultisigOnFinalized,
      onCancelled,
      onTxError,
    });
  }, [
    api,
    dispatch,
    signerAccount,
    getTxFunc,
    sendTxFunc,
    onSubmitted,
    maybeMultisigOnInBlock,
    maybeMultisigOnFinalized,
    onCancelled,
    onTxError,
  ]);

  return {
    isSubmitting,
    doSubmit,
  };
}
