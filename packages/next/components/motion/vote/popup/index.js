import PopupWithSigner from "next-common/components/popupWithSigner";
import toApiCouncil from "next-common/utils/toApiCouncil";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import PopupContent from "./popupContent";

export async function submitSubstrateExtrinsic({
  api,
  chain,
  type,
  motionHash,
  motionIndex,
  approve,
  dispatch,
  setLoading,
  onInBlock,
  onClose,
  signerAccount,
  isMounted,
}) {
  const voteMethod = api?.tx?.[toApiCouncil(chain, type)]?.vote;
  if (!voteMethod) {
    return dispatch(newErrorToast("Chain network is not connected yet"));
  }

  let tx = voteMethod(motionHash, motionIndex, approve);
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

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Vote"
      submitExtrinsic={submitSubstrateExtrinsic}
      {...props}
    >
      <PopupContent />
    </PopupWithSigner>
  );
}
