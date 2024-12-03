import Popup from "next-common/components/popup/wrapper/Popup";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useChain } from "next-common/context/chain";
import { isShibuyaChain } from "next-common/utils/chain";
import { useState } from "react";
import { ChoiceButton } from "../../newProposalButton/common";
import NewPreimageSVG from "../../newProposalButton/icons/new-preimage.svg";
import ApproveTreasuryProposalInnerPopup from "../approveTreasuryProposalInnerPopup";
import NewCouncilMotionProposalInnerPopup from "../newProposalInnerPopup";
import useIsCollectiveMember from "next-common/utils/hooks/collectives/useIsCollectiveMember";
import RejectTreasuryProposalInnerPopup from "../rejectTreasuryProposalInnerPopup";
import { useCollectivePallet } from "next-common/context/collective";
import ExternalProposeMajorityPopup from "../externalProposeMajorityPopup";
import ExternalProposeDefaultPopup from "../externalProposeDefaultPopup";

export default function SubmitCouncilMotionProposalPopupCommon({ children }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  const { onClose } = usePopupParams();
  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);
  const [
    showApproveTreasuryProposalPopup,
    setShowApproveTreasuryProposalPopup,
  ] = useState(false);
  const [showRejectTreasuryProposalPopup, setShowRejectTreasuryProposalPopup] =
    useState(false);
  const [
    showExternalProposeMajorityPopup,
    setShowExternalProposeMajorityPopup,
  ] = useState(false);
  const [showExternalProposeDefaultPopup, setShowExternalProposeDefaultPopup] =
    useState(false);
  const { isMember } = useIsCollectiveMember();

  if (showNewProposalPopup) {
    return (
      <NewCouncilMotionProposalInnerPopup
        onClose={onClose}
        isMember={isMember}
      />
    );
  }

  if (showApproveTreasuryProposalPopup) {
    return (
      <ApproveTreasuryProposalInnerPopup
        onClose={onClose}
        isMember={isMember}
      />
    );
  }

  if (showRejectTreasuryProposalPopup) {
    return (
      <RejectTreasuryProposalInnerPopup onClose={onClose} isMember={isMember} />
    );
  }

  if (showExternalProposeMajorityPopup) {
    return (
      <ExternalProposeMajorityPopup onClose={onClose} isMember={isMember} />
    );
  }

  if (showExternalProposeDefaultPopup) {
    return (
      <ExternalProposeDefaultPopup onClose={onClose} isMember={isMember} />
    );
  }

  const quickStartButtons = [];

  if (isShibuyaChain(chain)) {
    if (["communityCouncil", "council"].includes(collectivePallet)) {
      quickStartButtons.push(
        <ChoiceButton
          name="Approve a treasury proposal"
          description="Approve a treasury proposal"
          onClick={() => {
            setShowApproveTreasuryProposalPopup(true);
          }}
        />,
        <ChoiceButton
          name="Reject a treasury proposal"
          description="Reject a treasury proposal"
          onClick={() => {
            setShowRejectTreasuryProposalPopup(true);
          }}
        />,
      );

      if (collectivePallet === "council") {
        quickStartButtons.push(
          <ChoiceButton
            name="External propose majority"
            description="Schedule a majority-carries referendum to be tabled next once it is legal to schedule an external referendum"
            onClick={() => {
              setShowExternalProposeMajorityPopup(true);
            }}
          />,
          <ChoiceButton
            name="External propose default"
            description="Schedule a negative-turnout-bias referendum to be tabled next once it is legal to schedule an external referendum"
            onClick={() => {
              setShowExternalProposeDefaultPopup(true);
            }}
          />,
        );
      }
    }
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

      {quickStartButtons.length > 0 && (
        <QuickStart>{quickStartButtons}</QuickStart>
      )}

      {children}
    </Popup>
  );
}
