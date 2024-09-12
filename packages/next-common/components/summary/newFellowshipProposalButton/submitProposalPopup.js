import { useState } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { NewRemarkReferendumInnerPopup } from "../newProposalQuickStart/createSystemRemarkProposalPopup";
import { NewAssetSpendProposalInnerPopup } from "../newProposalQuickStart/newAssetSpendProposalInnerPopup";
import NewFellowshipCoreMemberPromoteReferendumInnerPopup from "../newProposalQuickStart/createFellowshipCoreMemberProposalPopup/createFellowshipCoreMemberPromotePopup";
import NewFellowshipCoreMemberRetainReferendumInnerPopup from "../newProposalQuickStart/createFellowshipCoreMemberProposalPopup/createFellowshipCoreMemberRetainPopup";

export default function SubmitFellowshipProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  const [showMemberPromotionPopup, setShowMemberPromotionPopup] =
    useState(false);
  const [showRetainPopup, setShowRetainPopup] = useState(false);
  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);
  const [showSpendPopup, setShowSpendPopup] = useState(false);

  let content;
  if (showMemberPromotionPopup) {
    content = <NewFellowshipCoreMemberPromoteReferendumInnerPopup />;
  } else if (showRetainPopup) {
    content = <NewFellowshipCoreMemberRetainReferendumInnerPopup />;
  } else if (showNewRemarkPopup) {
    content = <NewRemarkReferendumInnerPopup />;
  } else if (showSpendPopup) {
    content = <NewAssetSpendProposalInnerPopup />;
  } else {
    content = (
      <SubmitProposalPopupCommon
        setPreimageHash={setPreimageHash}
        setPreimageLength={setPreimageLength}
        newProposalPopup={
          <NewFellowshipProposalInnerPopup
            track={period}
            preimageHash={preimageHash}
            preimageLength={preimageLength}
          />
        }
      >
        <QuickStart>
          <ChoiceButton
            name="Promote"
            description="Promote a member to a higher rank"
            onClick={() => {
              setShowMemberPromotionPopup(true);
            }}
          />
          <ChoiceButton
            name="Retain"
            description="Retain a member at his/her current rank"
            onClick={() => {
              setShowRetainPopup(true);
            }}
          />
          <ChoiceButton
            name="Remark"
            description="Put remarks on chain"
            onClick={() => setShowNewRemarkPopup(true)}
          />
          <ChoiceButton
            name="Treasury proposal"
            description="Create a treasury spend of DOT from Asset Hub"
            onClick={() => setShowSpendPopup(true)}
          />
        </QuickStart>
      </SubmitProposalPopupCommon>
    );
  }

  return <SignerPopupWrapper onClose={onClose}>{content}</SignerPopupWrapper>;
}
