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
import DappStakingRegisterPopup from "../dappStakingRegisterPopup";
import DappStakingUnRegisterPopup from "../dappStakingUnRegisterPopup";
import DappStakingPopup from "../dappStakingPopup";

function useNewProposalPopupButton() {
  const [showNewProposalPopup, setShowNewProposalPopup] = useState(false);
  const newProposalPopupButton = (
    <ChoiceButton
      icon={<NewPreimageSVG />}
      name="New common"
      description="Create a new proposal"
      onClick={() => {
        setShowNewProposalPopup(true);
      }}
    />
  );
  return { newProposalPopupButton, showNewProposalPopup };
}

function useApproveTreasuryProposalButton() {
  const [
    showApproveTreasuryProposalPopup,
    setShowApproveTreasuryProposalPopup,
  ] = useState(false);
  const approveTreasuryProposalButton = (
    <ChoiceButton
      name="Approve a treasury proposal"
      description="Approve a treasury proposal"
      onClick={() => {
        setShowApproveTreasuryProposalPopup(true);
      }}
    />
  );
  return { approveTreasuryProposalButton, showApproveTreasuryProposalPopup };
}

function useRejectTreasuryProposalButton() {
  const [showRejectTreasuryProposalPopup, setShowRejectTreasuryProposalPopup] =
    useState(false);
  const rejectTreasuryProposalButton = (
    <ChoiceButton
      name="Reject a treasury proposal"
      description="Reject a treasury proposal"
      onClick={() => {
        setShowRejectTreasuryProposalPopup(true);
      }}
    />
  );
  return { rejectTreasuryProposalButton, showRejectTreasuryProposalPopup };
}

function useExternalProposeMajorityButton() {
  const [
    showExternalProposeMajorityPopup,
    setShowExternalProposeMajorityPopup,
  ] = useState(false);
  const externalProposeMajorityButton = (
    <ChoiceButton
      name="External propose majority"
      description="Schedule a majority-carries referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setShowExternalProposeMajorityPopup(true);
      }}
    />
  );
  return { externalProposeMajorityButton, showExternalProposeMajorityPopup };
}

function useExternalProposeDefaultButton() {
  const [showExternalProposeDefaultPopup, setShowExternalProposeDefaultPopup] =
    useState(false);
  const externalProposeDefaultButton = (
    <ChoiceButton
      name="External propose default"
      description="Schedule a negative-turnout-bias referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setShowExternalProposeDefaultPopup(true);
      }}
    />
  );
  return { externalProposeDefaultButton, showExternalProposeDefaultPopup };
}

function useDappStakingRegisterButton() {
  const [showDappStakingRegisterPopup, setShowDappStakingRegisterPopup] =
    useState(false);
  const dappStakingRegisterButton = (
    <ChoiceButton
      name="Register for dapp staking"
      description="Register a dapp on staking system to get support from the community"
      onClick={() => {
        setShowDappStakingRegisterPopup(true);
      }}
    />
  );
  return { dappStakingRegisterButton, showDappStakingRegisterPopup };
}

function useDappStakingUnRegisterButton() {
  const [showDappStakingUnRegisterPopup, setShowDappStakingUnRegisterPopup] =
    useState(false);
  const dappStakingUnRegisterButton = (
    <ChoiceButton
      name="Un-register from dapp staking"
      description="Un-register a dapp from the staking system"
      onClick={() => {
        setShowDappStakingUnRegisterPopup(true);
      }}
    />
  );
  return { dappStakingUnRegisterButton, showDappStakingUnRegisterPopup };
}

function useDappStakingButton() {
  const [showDappStakingPopup, setShowDappStakingPopup] = useState(false);
  const dappStakingButton = (
    <ChoiceButton
      name="Stake for a dapp"
      description="Request the staking amount from the community treasury for a dApp"
      onClick={() => {
        setShowDappStakingPopup(true);
      }}
    />
  );
  return { dappStakingButton, showDappStakingPopup };
}

export default function SubmitCouncilMotionProposalPopupCommon({ children }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  const { onClose } = usePopupParams();
  const { showNewProposalPopup, newProposalPopupButton } =
    useNewProposalPopupButton();
  const { showApproveTreasuryProposalPopup, approveTreasuryProposalButton } =
    useApproveTreasuryProposalButton();
  const { showRejectTreasuryProposalPopup, rejectTreasuryProposalButton } =
    useRejectTreasuryProposalButton();
  const { showExternalProposeMajorityPopup, externalProposeMajorityButton } =
    useExternalProposeMajorityButton();
  const { showExternalProposeDefaultPopup, externalProposeDefaultButton } =
    useExternalProposeDefaultButton();
  const { showDappStakingRegisterPopup, dappStakingRegisterButton } =
    useDappStakingRegisterButton();
  const { showDappStakingUnRegisterPopup, dappStakingUnRegisterButton } =
    useDappStakingUnRegisterButton();
  const { showDappStakingPopup, dappStakingButton } = useDappStakingButton();
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

  if (showDappStakingRegisterPopup) {
    return <DappStakingRegisterPopup onClose={onClose} isMember={isMember} />;
  }

  if (showDappStakingUnRegisterPopup) {
    return <DappStakingUnRegisterPopup onClose={onClose} isMember={isMember} />;
  }

  if (showDappStakingPopup) {
    return <DappStakingPopup onClose={onClose} isMember={isMember} />;
  }

  let quickStartButtons = null;

  if (isShibuyaChain(chain) && "communityCouncil" === collectivePallet) {
    quickStartButtons = [
      approveTreasuryProposalButton,
      rejectTreasuryProposalButton,
      dappStakingRegisterButton,
      dappStakingUnRegisterButton,
      dappStakingButton,
    ];
  }

  if (isShibuyaChain(chain) && "council" === collectivePallet) {
    quickStartButtons = [
      approveTreasuryProposalButton,
      rejectTreasuryProposalButton,
      externalProposeMajorityButton,
      externalProposeDefaultButton,
    ];
  }

  return (
    <Popup wide className="!w-[640px]" title="Submit Motion" onClose={onClose}>
      <div className="flex flex-col !mt-[24px] gap-[12px]">
        {newProposalPopupButton}
      </div>
      {quickStartButtons && <QuickStart>{quickStartButtons}</QuickStart>}
      {children}
    </Popup>
  );
}
