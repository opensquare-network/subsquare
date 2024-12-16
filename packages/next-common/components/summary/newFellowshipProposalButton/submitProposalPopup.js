import { useCallback } from "react";
import { NewFellowshipProposalInnerPopup } from "../newFellowshipProposalPopup";
import {
  ChoiceButton,
  NewPreimageButton,
  NewProposalFromPreimageButton,
} from "../newProposalButton/common";
import { usePageProps } from "next-common/context/page";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import dynamic from "next/dynamic";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";
import Popup from "next-common/components/popup/wrapper/Popup";
import { useChain } from "next-common/context/chain";
import { isCollectivesChain } from "next-common/utils/chain";

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

function CollectivesProposalQuickStart() {
  const chain = useChain();
  if (!isCollectivesChain(chain)) {
    return null;
  }
  return (
    <QuickStart>
      <Promote />
      <Retain />
      <NewRemark />
      <Spend />
    </QuickStart>
  );
}

function NewPreimage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    (hash, length) => {
      setForwardPopup(
        <NewFellowshipProposalInnerPopup
          track={period}
          preimageHash={hash}
          preimageLength={length}
        />,
      );
    },
    [period, setForwardPopup],
  );

  return (
    <NewPreimageButton
      onClick={() =>
        setForwardPopup(<NewPreimageInnerPopup onCreated={onPreimageCreated} />)
      }
    />
  );
}

function NewProposalFromPreImage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewProposalFromPreimageButton
      onClick={() =>
        setForwardPopup(<NewFellowshipProposalInnerPopup track={period} />)
      }
    />
  );
}

export default function SubmitFellowshipProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <Popup title="Submit Proposal" onClose={onClose}>
          <div className="flex flex-col !mt-[24px] gap-[12px]">
            <NewPreimage />
            <NewProposalFromPreImage />
          </div>
          <CollectivesProposalQuickStart />
        </Popup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
