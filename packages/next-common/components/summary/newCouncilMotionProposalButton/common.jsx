import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useChain } from "next-common/context/chain";
import { isShibuyaChain } from "next-common/utils/chain";
import { useState } from "react";
import { ChoiceButton } from "../newProposalButton/common";
import NewPreimageSVG from "../newProposalButton/icons/new-preimage.svg";
import ApproveTreasuryProposalInnerPopup from "./approveTreasuryProposalInnerPopup";
import NewCouncilMotionProposalInnerPopup from "./newProposalInnerPopup";

export default function SubmitCouncilMotionProposalPopupCommon({ children }) {
  const chain = useChain();
  const { onClose } = usePopupParams();
  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);
  const [
    showApproveTreasuryProposalPopup,
    setShowApproveTreasuryProposalPopup,
  ] = useState(false);

  if (showNewProposalPopup) {
    return (
      <NewCouncilMotionProposalInnerPopup
        onClose={onClose}
        onProposed={() => {
          setShowNewProposalPopup(false);
        }}
      />
    );
  }

  if (showApproveTreasuryProposalPopup) {
    return <ApproveTreasuryProposalInnerPopup onClose={onClose} />;
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

      {isShibuyaChain(chain) && (
        <QuickStart>
          <ChoiceButton
            name="Approve a treasury proposal"
            description="Approve a treasury proposal"
            onClick={() => {
              setShowApproveTreasuryProposalPopup(true);
            }}
          />
        </QuickStart>
      )}

      {children}
    </Popup>
  );
}
