import { emptyFunction } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PopupContent from "./popupContent";

export async function submitSubstrateExtrinsic({
  api,
  trackIds,
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
  let tx;
  if (trackIds.length === 1) {
    tx = api.tx.convictionVoting.delegate(
      trackIds[0],
      targetAddress,
      conviction,
      bnVoteBalance.toString(),
    );
  } else {
    tx = api.tx.utility.batch(
      trackIds.map((trackId) =>
        api.tx.convictionVoting.delegate(
          trackId,
          targetAddress,
          conviction,
          bnVoteBalance.toString(),
        ),
      ),
    );
  }

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
