import { useState } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import SubmitProposalPopupCommon from "./common";
import SpendLocalTemplateProvider from "./templates/spendLocal";
import SpendUSDxTemplateProvider from "./templates/spendUSDx";
import NewRemarkTemplateProvider from "./templates/newRemark";
import ReferendumTemplates from "next-common/components/summary/newProposalButton/templates";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

export default function SubmitProposalPopup({ onClose }) {
  const { period } = usePageProps();
  const [preimageHash, setPreimageHash] = useState();
  const [preimageLength, setPreimageLength] = useState();

  return (
    <SignerPopupWrapper onClose={onClose}>
      <SpendLocalTemplateProvider>
        <SpendUSDxTemplateProvider>
          <NewRemarkTemplateProvider>
            <SubmitProposalPopupCommon
              setPreimageHash={setPreimageHash}
              setPreimageLength={setPreimageLength}
              newProposalPopup={
                <NewProposalInnerPopup
                  track={period}
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
    </SignerPopupWrapper>
  );
}
