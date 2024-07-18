import { useChainSettings } from "next-common/context/chain";
import React, { useState } from "react";
import { NewTreasuryReferendumInnerPopup } from "next-common/components/summary/newProposalQuickStart/createTreasuryProposalPopup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { ChoiceButton } from "../common";

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
      <ChoiceButton
        name="Treasury proposal local"
        description="Creating a treasury spend of native token that is locally available"
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
