import { useState } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import dynamic from "next/dynamic";

const NewRemarkReferendumInnerPopup = dynamic(() =>
  import("../newProposalQuickStart/createSystemRemarkProposalPopup").then(
    (mod) => mod.NewRemarkReferendumInnerPopup,
  ),
);
const NewAssetSpendProposalInnerPopup = dynamic(() =>
  import("../newProposalQuickStart/newAssetSpendProposalInnerPopup").then(
    (mod) => mod.NewAssetSpendProposalInnerPopup,
  ),
);
const NewFellowshipCoreMemberPromoteReferendumInnerPopup = dynamic(() =>
  import(
    "../newProposalQuickStart/createFellowshipCoreMemberProposalPopup/createFellowshipCoreMemberPromotePopup"
  ).then((mod) => mod.default),
);
const NewFellowshipCoreMemberRetainReferendumInnerPopup = dynamic(() =>
  import(
    "../newProposalQuickStart/createFellowshipCoreMemberProposalPopup/createFellowshipCoreMemberRetainPopup"
  ).then((mod) => mod.default),
);

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
            name="Treasury spend"
            description="Create a treasury spend of DOT from AssetHub"
            onClick={() => setShowSpendPopup(true)}
          />
        </QuickStart>
      </SubmitProposalPopupCommon>
    );
  }

  return <SignerPopupWrapper onClose={onClose}>{content}</SignerPopupWrapper>;
}
