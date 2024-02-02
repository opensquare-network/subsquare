import React, { useCallback, useState } from "react";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { emptyFunction } from "next-common/utils";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PrimaryButton from "next-common/components/buttons/primaryButton";

export default function TxSubmissionButton({
  tx,
  errorCheck = emptyFunction,
  title = "Submit",
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
}) {
  const [isCalling, setIsCalling] = useState(false);
  const api = useApi();
  const dispatch = useDispatch();
  const signerAccount = useSignerAccount();
  const isMounted = useIsMounted();

  const onSubmit = useCallback(async () => {
    if (!tx) {
      return;
    }

    if (!api) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!signerAccount) {
      dispatch(newErrorToast("Signer account is not specified"));
      return;
    }

    if (errorCheck()) {
      return;
    }

    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setIsCalling,
      signerAddress: signerAccount.address,
      isMounted,
      onClose,
      onSubmitted,
      onInBlock,
      onFinalized,
    });
  }, [tx, api, dispatch, signerAccount]);

  return (
    <div className="flex justify-end">
      <PrimaryButton isLoading={isCalling} onClick={onSubmit} disabled={!tx}>
        {title}
      </PrimaryButton>
    </div>
  );
}
