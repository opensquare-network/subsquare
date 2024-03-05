import PopupWithSigner from "next-common/components/popupWithSigner";
import useMoonStandardVote from "components/referenda/popup/voteHooks/useMoonStandardVote";
import useMoonSplitVote from "components/referenda/popup/voteHooks/useMoonSplitVote";
import useMoonSplitAbstainVote from "./voteHooks/useMoonSplitAbstainVote";
import PopupContent from "./popupContent";
import { submitExtrinsic } from "components/referenda/popup/moonPopup";

export default function MoonPopup(props) {
  return (
    <PopupWithSigner
      title="Referendum vote"
      useStandardVote={useMoonStandardVote}
      useSplitVote={useMoonSplitVote}
      useSplitAbstainVote={useMoonSplitAbstainVote}
      submitExtrinsic={submitExtrinsic}
      {...props}
    >
      <PopupContent />
    </PopupWithSigner>
  );
}
