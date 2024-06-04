import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import React, { useState } from "react";
import NewTreasuryReferendumPopup from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";

const SpendLocalTemplateContext = React.createContext();

export default function SpendLocalTemplateProvider({ onClose, children }) {
  const settings = useChainSettings();
  const [showCreateTreasuryProposal, setShowCreateTreasuryProposal] =
    useState(false);

  let button = null;
  let popup = null;

  if (settings.treasuryProposalTracks) {
    button = (
      <QuickStartButton
        title="Treasury spend local"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
    );
    popup = <NewTreasuryReferendumPopup onClose={onClose} />;
  }

  if (showCreateTreasuryProposal) {
    return popup;
  }

  return (
    <SpendLocalTemplateContext.Provider value={{ button }}>
      {children}
    </SpendLocalTemplateContext.Provider>
  );
}

export function useSpendLocalButton() {
  const { button } = React.useContext(SpendLocalTemplateContext);
  return button;
}
