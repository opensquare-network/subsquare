import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PrimaryButton from "next-common/lib/button/primary";
import { useContextApi } from "next-common/context/api";
import LoadingButton from "next-common/lib/button/loading";

export default function TxSubmissionButton({
  loading = false,
  loadingText,
  disabled = false,
  getTxFunc = emptyFunction,
  title = "Submit",
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
}) {
  const [isCalling, setIsCalling] = useState(false);
  const api = useContextApi();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const isMounted = useIsMounted();

  const onSubmit = useCallback(async () => {
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
      setLoading: setIsCalling,
      signerAccount,
      isMounted,
      onClose,
      onSubmitted,
      onInBlock,
      onFinalized,
    });
  }, [api, dispatch, signerAccount, getTxFunc]);

  return (
    <div className="flex justify-end">
      {(isCalling || loading) && loadingText ? (
        <LoadingButton>{loadingText}</LoadingButton>
      ) : (
        <PrimaryButton
          loading={isCalling}
          onClick={onSubmit}
          disabled={disabled}
        >
          {title}
        </PrimaryButton>
      )}
    </div>
  );
}
