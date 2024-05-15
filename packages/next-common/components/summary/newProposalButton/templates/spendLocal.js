import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import { useState } from "react";
import CreateTreasuryProposalPopup from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";

export default function SpendLocalTemplate() {
  const settings = useChainSettings();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);

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
      {showCreateTreasuryProposal && <CreateTreasuryProposalPopup />}
    </>
  );
}
