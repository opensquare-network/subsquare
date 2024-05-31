import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import { useState } from "react";
import { usePopupOnClose } from "next-common/context/popup";
import NewTreasuryReferendumPopup from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";

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
        title="Local treasury proposal"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
      {showCreateTreasuryProposal && (
        <NewTreasuryReferendumPopup onClose={onClose} />
      )}
    </>
  );
}
