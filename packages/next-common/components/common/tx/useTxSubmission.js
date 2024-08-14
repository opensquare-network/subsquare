import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import { useMountedState } from "react-use";
import { noop } from "lodash-es";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { useContextApi } from "next-common/context/api";

export default function useTxSubmission({
  getTxFunc = noop,
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
}) {
  const dispatch = useDispatch();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const isMounted = useMountedState();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      signerAccount,
      isMounted,
      onClose,
      onSubmitted,
      onInBlock,
      onFinalized,
    });
  }, [api, dispatch, signerAccount, getTxFunc]);

  return {
    isSubmitting,
    doSubmit,
  };
}
