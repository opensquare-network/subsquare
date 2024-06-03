import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import { useState } from "react";
import { usePopupOnClose } from "next-common/context/popup";
import NewUSDxTreasuryReferendumPopup from "../../newProposalQuickStart/createUSDxTreasuryProposalPopup";
import { AssetHubApiProvider } from "next-common/context/assetHub";

export default function SpendUSDxTemplate() {
  const settings = useChainSettings();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);
  const onClose = usePopupOnClose();

  if (!settings.treasuryProposalTracks) {
    return null;
  }

  if (!settings.newProposalQuickStart?.usdxTreasuryProposal) {
    return null;
  }

  return (
    <AssetHubApiProvider>
      <QuickStartButton
        title="USDx treasury proposal"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
      {showCreateTreasuryProposal && (
        <NewUSDxTreasuryReferendumPopup onClose={onClose} />
      )}
    </AssetHubApiProvider>
  );
}
