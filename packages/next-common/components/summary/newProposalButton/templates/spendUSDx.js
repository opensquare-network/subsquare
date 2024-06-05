import { useChainSettings } from "next-common/context/chain";
import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import React, { useState } from "react";
import { NewUSDxTreasuryReferendumInnerPopup } from "../../newProposalQuickStart/createUSDxTreasuryProposalPopup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

const SpendUSDxTemplateContext = React.createContext();

export default function SpendUSDxTemplateProvider({ children }) {
  const { onClose } = usePopupParams();
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
        title="Treasury USDx spend"
        onClick={() => setShowCreateTreasuryProposal(true)}
      />
    );
    popup = <NewUSDxTreasuryReferendumInnerPopup onClose={onClose} />;
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
