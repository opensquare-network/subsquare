import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { emptyFunction } from "next-common/utils";

export async function submitPolkadotExtrinsic({
  api,
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  let tx = api.tx.democracy.delegate(
    targetAddress,
    conviction,
    bnVoteBalance.toString(),
  );

  if (signerAccount?.proxyAddress) {
    tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
  }

  await sendTx({
    tx,
    dispatch,
    setLoading,
    onInBlock,
    onClose,
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export default function DelegatePopup(props) {
  return (
    <PopupWithSigner
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      submitExtrinsic={submitPolkadotExtrinsic}
      {...props}
    />
  );
}
