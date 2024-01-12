import React, { useState } from "react";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import { emptyFunction } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import SignerPopup from "next-common/components/signerPopup";
import { Input } from "../styled";

export default function SubmissionDepositRefundPopup({
  pallet = "referenda",
  referendumIndex,
  onClose = emptyFunction,
}) {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const [calling, setCalling] = useState(false);

  const showErrorToast = (message) => dispatch(newErrorToast(message));

  const doRefund = async (api, signerAccount) => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    let tx = api.tx[pallet].refundSubmissionDeposit(referendumIndex);
    if (signerAccount?.proxyAddress) {
      tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
    }

    await sendTx({
      tx,
      dispatch,
      setLoading: setCalling,
      onClose,
      signerAccount,
      isMounted,
    });
  };

  return (
    <SignerPopup
      title="Refund submission deposit"
      actionCallback={doRefund}
      isLoading={calling}
      onClose={onClose}
    >
      <div>
        <PopupLabel text="Referendum Index" />
        <div>
          <Input disabled={true} value={referendumIndex} />
        </div>
      </div>
    </SignerPopup>
  );
}
