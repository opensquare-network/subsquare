import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import React, { useState } from "react";
import { NewTreasuryReferendumInnerPopup } from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

const SpendLocalTemplateContext = React.createContext();

export default function SpendLocalTemplateProvider({ children }) {
  const { onClose } = usePopupParams();
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
    popup = <NewTreasuryReferendumInnerPopup onClose={onClose} />;
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
