import PopupWithAddress from "next-common/components/popupWithAddress";
import useStandardVote from "components/referenda/popup/voteHooks/useStandardVote";
import useSplitVote from "components/referenda/popup/voteHooks/useSplitVote";
import useSplitAbstainVote from "./voteHooks/useSplitAbstainVote";
import PopupContent from "./popupContent";
import { submitPolkadotExtrinsic } from "components/referenda/popup";

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Referendum vote"
      Component={PopupContent}
      useStandardVote={useStandardVote}
      useSplitVote={useSplitVote}
      useSplitAbstainVote={useSplitAbstainVote}
      submitExtrinsic={submitPolkadotExtrinsic}
      {...props}
    />
  );
}
