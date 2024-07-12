import { useState } from "react";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import MainPopup from "./mainPopup";
import { NewPreimageInnerPopup } from "../newPreimagePopup";
import NewLocalTreasuryProposalPopup from "./newLocalTreasuryProposalPopup";
import NewUSDxTreasuryProposalPopup from "./newUSDxTreasuryProposalPopup";
import NewRemarkProposalPopup from "./newRemarkProposalPopup";
import { useChainSettings } from "next-common/context/chain";

function PreimageTemplates({ children }) {
  return (
    <div className="flex flex-col gap-[8px] mt-[24px]">
      <h6 className="text-textPrimary text14Bold">Quick Start</h6>
      <div className="flex flex-col flex-wrap gap-[8px]">{children}</div>
    </div>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const [showNewPreimage, setShowNewPreimage] = useState();
  const [showLocalTreasuryTemplate, setShowLocalTreasuryTemplate] = useState();
  const [showUSDxTreasuryTemplate, setShowUSDxTreasuryTemplate] = useState();
  const [showRemarkTemplate, setShowRemarkTemplate] = useState();

  const {
    treasuryProposalTracks,
    newProposalQuickStart: { usdxTreasuryProposal } = {},
  } = useChainSettings();

  if (showNewPreimage) {
    return <NewPreimageInnerPopup onClose={onClose} />;
  }

  if (showLocalTreasuryTemplate) {
    return <NewLocalTreasuryProposalPopup onClose={onClose} />;
  }

  if (showUSDxTreasuryTemplate) {
    return <NewUSDxTreasuryProposalPopup onClose={onClose} />;
  }

  if (showRemarkTemplate) {
    return <NewRemarkProposalPopup onClose={onClose} />;
  }

  const hasTreasurySpend = !!treasuryProposalTracks;
  const hasSpendUSDx = hasTreasurySpend && !!usdxTreasuryProposal;

  const buttons = [
    hasTreasurySpend && (
      <ChoiceButton
        key="spend-local"
        name="Treasury proposal local"
        description="Creating a treasury spend of native token that is locally available"
        onClick={() => setShowLocalTreasuryTemplate(true)}
      />
    ),
    hasSpendUSDx && (
      <ChoiceButton
        key="spend-usdx"
        name="USDx treasury proposal"
        description="Creating a treasury spend with assets on AssetHub"
        onClick={() => setShowUSDxTreasuryTemplate(true)}
      />
    ),
    <ChoiceButton
      key="remark"
      name="Remark"
      description="Creating a remark proposal"
      onClick={() => setShowRemarkTemplate(true)}
    />,
  ];

  return (
    <MainPopup setShowNewPreimage={setShowNewPreimage} onClose={onClose}>
      <PreimageTemplates>{buttons}</PreimageTemplates>
    </MainPopup>
  );
}

export default function CreatePreimagePopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <PopupContent />
    </SignerPopupWrapper>
  );
}
