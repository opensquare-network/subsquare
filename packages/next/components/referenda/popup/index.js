import PopupWithSigner from "next-common/components/popupWithSigner";
import AyeNaySplitTab from "./ayeNaySplitTab";
import useStandardVote from "./voteHooks/useStandardVote";
import useSplitVote from "./voteHooks/useSplitVote";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

export async function submitSubstrateExtrinsic({
  api,
  getVoteTx,
  dispatch,
  setLoading,
  onInBlock,
  onSubmitted,
  onClose,
  signerAccount,
  isMounted,
}) {
  let tx = getVoteTx();
  if (!tx) {
    return;
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
    signerAccount,
    isMounted,
  });
}

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Referendum vote"
      useStandardVote={useStandardVote}
      useSplitVote={useSplitVote}
      VoteTypeTab={AyeNaySplitTab}
      submitExtrinsic={submitSubstrateExtrinsic}
      {...props}
    >
      <PopupContent />
    </PopupWithSigner>
  );
}
