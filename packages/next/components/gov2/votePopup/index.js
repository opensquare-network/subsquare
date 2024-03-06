import PopupWithSigner from "next-common/components/popupWithSigner";
import useStandardVote from "components/referenda/popup/voteHooks/useStandardVote";
import useSplitVote from "components/referenda/popup/voteHooks/useSplitVote";
import useSplitAbstainVote from "./voteHooks/useSplitAbstainVote";
import PopupContent from "./popupContent";
import { submitSubstrateExtrinsic } from "components/referenda/popup";

export default function Popup(props) {
  return (
    <PopupWithSigner
      title="Referendum vote"
      useStandardVote={useStandardVote}
      useSplitVote={useSplitVote}
      useSplitAbstainVote={useSplitAbstainVote}
      submitExtrinsic={submitSubstrateExtrinsic}
      {...props}
    >
      <PopupContent />
    </PopupWithSigner>
  );
}
