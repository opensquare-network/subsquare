import { emptyFunction } from "next-common/utils";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import PopupContent from "./popupContent";

export async function submitPolkadotExtrinsic({
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
      bnVoteBalance.toString()
    );
  } else {
    tx = api.tx.utility.batch(
      trackIds.map((trackId) =>
        api.tx.convictionVoting.delegate(
          trackId,
          targetAddress,
          conviction,
          bnVoteBalance.toString()
        )
      )
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
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export default function DelegatePopup(props) {
  return (
    <PopupWithAddress
      title="Delegate"
      Component={PopupContent}
      autoCloseAfterLogin={true}
      submitExtrinsic={submitPolkadotExtrinsic}
      {...props}
    />
  );
}
