import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { SubmitDemocracyProposalInnerPopup } from "next-common/components/summary/newDemocracyProposalButton/submitDemocracyProposalPopup";
import { NewTreasuryReferendumInnerPopup } from "./quickStart/newTreasuryReferendumInnerPopup";
import { useSpendLocalTreasuryButton } from "next-common/components/preImages/createPreimagePopup/templateButtons";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

function NewDemocracyProposalInnerPopup() {
  const { showSpendLocalTreasuryPopup, localTreasuryButton } =
    useSpendLocalTreasuryButton(false);

  if (showSpendLocalTreasuryPopup) {
    return <NewTreasuryReferendumInnerPopup />;
  }

  return (
    <SubmitDemocracyProposalInnerPopup>
      <QuickStart>{localTreasuryButton}</QuickStart>
    </SubmitDemocracyProposalInnerPopup>
  );
}

export default function NewDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <NewDemocracyProposalInnerPopup />
    </SignerPopupWrapper>
  );
}
