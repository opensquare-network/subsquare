import PopupWithAddress from "next-common/components/popupWithAddress";
import useMoonStandardVote from "components/referenda/popup/voteHooks/useMoonStandardVote";
import useMoonSplitVote from "components/referenda/popup/voteHooks/useMoonSplitVote";
import useMoonSplitAbstainVote from "./voteHooks/useMoonSplitAbstainVote";
import PopupContent from "./popupContent";
import { submitExtrinsic } from "components/referenda/popup/moonPopup";

export default function MoonPopup(props) {
  return (
    <PopupWithAddress
      title="Referendum vote"
      Component={PopupContent}
      useStandardVote={useMoonStandardVote}
      useSplitVote={useMoonSplitVote}
      useSplitAbstainVote={useMoonSplitAbstainVote}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
