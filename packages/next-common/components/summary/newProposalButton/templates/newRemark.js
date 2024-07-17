import React, { useState } from "react";
import { NewRemarkReferendumInnerPopup } from "../../newProposalQuickStart/createSystemRemarkProposalPopup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { ChoiceButton } from "../common";

const NewRemarkTemplateContext = React.createContext();

export default function NewRemarkTemplateProvider({ children }) {
  const { onClose } = usePopupParams();
  const [showNewRemarkPopup, setShowNewRemarkPopup] = useState(false);

  if (showNewRemarkPopup) {
    return <NewRemarkReferendumInnerPopup onClose={onClose} />;
  }

  const button = (
    <ChoiceButton
      name="Remark"
      description="Creating a remark proposal"
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
