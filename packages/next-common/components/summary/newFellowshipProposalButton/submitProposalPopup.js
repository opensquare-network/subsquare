import { useState } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import SubmitProposalPopupCommon, {
  ChoiceButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import dynamic from "next/dynamic";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";

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

function Promote() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Promote"
      description="Promote a member to a higher rank"
      onClick={() =>
        setForwardPopup(<NewFellowshipCoreMemberPromoteReferendumInnerPopup />)
      }
    />
  );
}

function Retain() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Retain"
      description="Retain a member at his/her current rank"
      onClick={() =>
        setForwardPopup(<NewFellowshipCoreMemberRetainReferendumInnerPopup />)
      }
    />
  );
}

function NewRemark() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Remark"
      description="Put remarks on chain"
      onClick={() => setForwardPopup(<NewRemarkReferendumInnerPopup />)}
    />
  );
}

function Spend() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Fellowship treasury spend"
      description="Create a treasury spend of DOT from AssetHub fellowship treasury account"
      onClick={() => setForwardPopup(<NewAssetSpendProposalInnerPopup />)}
    />
  );
}

function FellowshipProposalQuickStart() {
  return (
    <QuickStart>
      <Promote />
      <Retain />
      <NewRemark />
      <Spend />
    </QuickStart>
  );
}

export default function SubmitFellowshipProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
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
          <FellowshipProposalQuickStart />
        </SubmitProposalPopupCommon>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
