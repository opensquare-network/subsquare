import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { noop } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { wrapWithProxy } from "next-common/utils/sendTransaction";
import { useContextApi } from "next-common/context/api";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";

export default function useTxSubmission({
  getTxFunc = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
}) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const { sendTx, isLoading: isSubmitting } = useSendTransaction();

  const doSubmit = useCallback(async () => {
    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!signerAccount) {
      dispatch(newErrorToast("Signer account is not specified"));
      return;
    }

    let tx = await getTxFunc();
    if (!tx) {
      return;
    } else if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      api,
      tx,
      onSubmitted,
      onInBlock,
      onFinalized,
    });
  }, [
    api,
    dispatch,
    signerAccount,
    getTxFunc,
    sendTx,
    onSubmitted,
    onInBlock,
    onFinalized,
  ]);

  return {
    isSubmitting,
    doSubmit,
  };
}
