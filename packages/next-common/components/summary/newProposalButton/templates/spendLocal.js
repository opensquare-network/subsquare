import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import { useState } from "react";
import CreateTreasuryProposalPopup from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";
import { usePopupOnClose } from "next-common/context/popup";

export default function SpendLocalTemplate() {
  const settings = useChainSettings();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);
  const onClose = usePopupOnClose();

  if (!settings.treasuryProposalTracks) {
    return null;
  }

  return (
    <>
      <QuickStartButton
        key="treasury-proposal"
        title="Create a treasury proposal"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
      {showCreateTreasuryProposal && (
        <CreateTreasuryProposalPopup onClose={onClose} />
      )}
    </>
  );
}
