import QuickStartButton from "next-common/components/summary/newProposalButton/templates/button";
import React, { useState } from "react";
import NewRemarkReferendumPopup from "../../newProposalQuickStart/createSystemRemarkProposalPopup";

const NewRemarkTemplateContext = React.createContext();

export default function NewRemarkTemplateProvider({ onClose, children }) {
  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);

  if (showNewRemarkPopup) {
    return <NewRemarkReferendumPopup onClose={onClose} />;
  }

  const button = (
    <QuickStartButton
      title="Remark proposal"
      onClick={() => setShowNewRemarkPopup(true)}
    />
  );

  return (
    <NewRemarkTemplateContext.Provider value={{ button }}>
      {children}
    </NewRemarkTemplateContext.Provider>
  );
}

export function useNewRemarkButton() {
  const { button } = React.useContext(NewRemarkTemplateContext);
  return button;
}
