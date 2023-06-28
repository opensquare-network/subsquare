import React from "react";
import PopupWithAddress from "../../../popupWithAddress";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { newErrorToast } from "next-common/store/reducers/toastSlice";

export async function submitPolkadotExtrinsic({
  api,
  proposalIndex,
  depositorUpperBound,
  times,
  dispatch,
  setLoading,
  onSubmitted,
  onInBlock,
  onFinalized,
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
    onFinalized,
    onInBlock,
    onSubmitted,
    onClose,
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Second"
      Component={PopupContent}
      submitExtrinsic={submitPolkadotExtrinsic}
      {...props}
    />
  );
}
