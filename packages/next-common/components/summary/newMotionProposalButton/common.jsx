import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useCallback, useState } from "react";
import { ChoiceButton } from "../newProposalButton/common";
import NewPreimageSVG from "../newProposalButton/icons/new-preimage.svg";
import NewMotionProposalInnerPopup from "./newProposalInnerPopup";

export default function SubmitMotionProposalPopupCommon({ children }) {
  const { onClose } = usePopupParams();
  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);

  const onProposalCreated = useCallback(() => {
    setShowNewProposalPopup(false);
  }, []);

  if (showNewProposalPopup) {
    return (
      <NewMotionProposalInnerPopup
        onClose={onClose}
        onCreated={onProposalCreated}
      />
    );
  }

  return (
    <Popup wide className="!w-[640px]" title="Submit Motion" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[12px]">
        <ChoiceButton
          icon={<NewPreimageSVG />}
          name="New common"
          description="Create a new proposal"
          onClick={() => {
            setShowNewProposalPopup(true);
          }}
        />
      </div>
      {children}
    </Popup>
  );
}
