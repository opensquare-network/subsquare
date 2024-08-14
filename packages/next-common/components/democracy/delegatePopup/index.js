import React from "react";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { noop } from "lodash-es";

export async function submitSubstrateExtrinsic({
  api,
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = noop,
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
    signerAccount,
    isMounted,
  });
}

export default function DelegatePopup({
  defaultTargetAddress,
  targetDisabled,
  ...props
}) {
  return (
    <PopupWithSigner
      title="Delegate"
      className="!w-[640px]"
      submitExtrinsic={submitSubstrateExtrinsic}
      {...props}
    >
      <PopupContent
        defaultTargetAddress={defaultTargetAddress}
        targetDisabled={targetDisabled}
      />
    </PopupWithSigner>
  );
}
