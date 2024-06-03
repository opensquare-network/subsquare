import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import React, { useState } from "react";
import NewUSDxTreasuryReferendumPopup from "../../newProposalQuickStart/createUSDxTreasuryProposalPopup";

const SpendUSDxTemplateContext = React.createContext();

export default function SpendUSDxTemplateProvider({ onClose, children }) {
  const settings = useChainSettings();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);

  let button = null;
  let popup = null;

  if (
    settings.treasuryProposalTracks &&
    settings.newProposalQuickStart?.usdxTreasuryProposal
  ) {
    button = (
      <QuickStartButton
        title="USDx treasury proposal"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
    );
    popup = <NewUSDxTreasuryReferendumPopup onClose={onClose} />;
  }

  if (showCreateTreasuryProposal) {
    return popup;
  }

  return (
    <SpendUSDxTemplateContext.Provider value={{ button }}>
      {children}
    </SpendUSDxTemplateContext.Provider>
  );
}

export function useSpendUSDxButton() {
  const { button } = React.useContext(SpendUSDxTemplateContext);
  return button;
}
