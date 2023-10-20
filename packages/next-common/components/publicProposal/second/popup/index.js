import React from "react";
import PopupWithSigner from "../../../popupWithSigner";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export async function submitSubstrateExtrinsic({
  api,
  proposalIndex,
  depositorUpperBound,
  times,
  dispatch,
  setLoading,
  onSubmitted,
  onInBlock,
  onClose,
  signerAccount,
  isMounted,
}) {
  let tx = null;
  try {
    if (api.tx.democracy?.second?.meta.args.length < 2) {
      tx = api.tx.democracy.second(proposalIndex);
    } else {
      tx = api.tx.democracy.second(proposalIndex, depositorUpperBound || 1);
    }
  } catch (e) {
    return dispatch(newErrorToast(e.message));
  }

  if (times > 1) {
    const txs = Array.from({ length: times }).fill(tx);
    tx = api.tx.utility.batch(txs);
  }

  if (signerAccount?.proxyAddress) {
    tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
  }

  await sendTx({
    tx,
    dispatch,
    setLoading,
    onInBlock,
    onSubmitted,
    onClose,
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Second"
      Component={PopupContent}
      submitExtrinsic={submitSubstrateExtrinsic}
      {...props}
    />
  );
}
