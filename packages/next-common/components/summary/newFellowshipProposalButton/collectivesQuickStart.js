import { ChoiceButton } from "../newProposalButton/common";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import dynamic from "next/dynamic";
import { useForwardPopupContext } from "next-common/context/forwardPopup";
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

export default function CollectivesProposalQuickStart() {
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
