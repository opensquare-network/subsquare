import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { SubmitDemocracyProposalInnerPopup } from "next-common/components/summary/newDemocracyProposalButton/submitDemocracyProposalPopup";
import { NewTreasuryReferendumInnerPopup } from "./quickStart/newTreasuryReferendumInnerPopup";
import { SpendLocalTreasuryButton } from "next-common/components/preImages/createPreimagePopup/templateButtons";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";

function SpendLocalTreasury() {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <SpendLocalTreasuryButton
      onClick={() => setForwardPopup(<NewTreasuryReferendumInnerPopup />)}
    />
  );
}

function KintsugiDemocracyProposalQuickStart() {
  return (
    <QuickStart>
      <SpendLocalTreasury />
    </QuickStart>
  );
}

export default function NewDemocracyProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <SubmitDemocracyProposalInnerPopup>
          <KintsugiDemocracyProposalQuickStart />
        </SubmitDemocracyProposalInnerPopup>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
  );
}
