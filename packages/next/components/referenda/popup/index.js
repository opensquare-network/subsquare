import PopupWithAddress from "next-common/components/popupWithAddress";
import AyeNaySplitTab from "./ayeNaySplitTab";
import useStandardVote from "./voteHooks/useStandardVote";
import useSplitVote from "./voteHooks/useSplitVote";
import PopupContent from "./popupContent";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

export async function submitPolkadotExtrinsic({
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
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Referendum vote"
      Component={PopupContent}
      useStandardVote={useStandardVote}
      useSplitVote={useSplitVote}
      VoteTypeTab={AyeNaySplitTab}
      submitExtrinsic={submitPolkadotExtrinsic}
      {...props}
    />
  );
}
