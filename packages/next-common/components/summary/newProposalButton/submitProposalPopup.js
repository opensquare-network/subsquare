import { useState } from "react";
import NewProposalPopup from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";
import ReferendumTemplates from "next-common/components/summary/newProposalButton/templates";
import SpendLocalTemplateProvider from "./templates/spendLocal";
import SpendUSDxTemplateProvider from "./templates/spendUSDx";
import NewRemarkTemplateProvider from "./templates/newRemark";

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SpendLocalTemplateProvider onClose={onClose}>
      <SpendUSDxTemplateProvider onClose={onClose}>
        <NewRemarkTemplateProvider onClose={onClose}>
          <SubmitProposalPopupCommon
            setPreimageHash={setPreimageHash}
            setPreimageLength={setPreimageLength}
            onClose={onClose}
            newProposalPopup={
              <NewProposalPopup
                track={period}
                onClose={onClose}
                preimageHash={preimageHash}
                preimageLength={preimageLength}
              />
            }
          >
            <ReferendumTemplates />
          </SubmitProposalPopupCommon>
        </NewRemarkTemplateProvider>
      </SpendUSDxTemplateProvider>
    </SpendLocalTemplateProvider>
  );
}
