import { QuickStart } from "next-common/components/preImages/createPreimagePopup";
import { useChain } from "next-common/context/chain";
import { isShibuyaChain } from "next-common/utils/chain";
import { ChoiceButton } from "../../newProposalButton/common";
import ApproveTreasuryProposalInnerPopup from "../approveTreasuryProposalInnerPopup";
import RejectTreasuryProposalInnerPopup from "../rejectTreasuryProposalInnerPopup";
import { useCollectivePallet } from "next-common/context/collective";
import ExternalProposeMajorityPopup from "../externalProposeMajorityPopup";
import ExternalProposeDefaultPopup from "../externalProposeDefaultPopup";
import DappStakingRegisterPopup from "../dappStakingRegisterPopup";
import DappStakingUnRegisterPopup from "../dappStakingUnRegisterPopup";
import CollectiveProxyCallPopup from "../collectiveProxyCallPopup";
import { useForwardPopupContext } from "next-common/context/forwardPopup";

function ApproveTreasuryProposalButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Approve a treasury proposal"
      description="Approve a treasury proposal"
      onClick={() => {
        setForwardPopup(
          <ApproveTreasuryProposalInnerPopup
            onClose={onClose}
            isMember={isMember}
          />,
        );
      }}
    />
  );
}

function RejectTreasuryProposalButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Reject a treasury proposal"
      description="Reject a treasury proposal"
      onClick={() => {
        setForwardPopup(
          <RejectTreasuryProposalInnerPopup
            onClose={onClose}
            isMember={isMember}
          />,
        );
      }}
    />
  );
}

function ExternalProposeMajorityButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Democracy external propose majority"
      description="Schedule a majority-carries referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setForwardPopup(
          <ExternalProposeMajorityPopup
            onClose={onClose}
            isMember={isMember}
          />,
        );
      }}
    />
  );
}

function ExternalProposeDefaultButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Democracy external propose default"
      description="Schedule a negative-turnout-bias referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setForwardPopup(
          <ExternalProposeDefaultPopup onClose={onClose} isMember={isMember} />,
        );
      }}
    />
  );
}

function DappStakingRegisterButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Register for dapp staking"
      description="Register a dapp on staking system to get support from the community"
      onClick={() => {
        setForwardPopup(
          <DappStakingRegisterPopup onClose={onClose} isMember={isMember} />,
        );
      }}
    />
  );
}

function DappStakingUnRegisterButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Un-register from dapp staking"
      description="Un-register a dapp from the staking system"
      onClick={() => {
        setForwardPopup(
          <DappStakingUnRegisterPopup onClose={onClose} isMember={isMember} />,
        );
      }}
    />
  );
}

function CollectiveProxyCallButton({ onClose, isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Community proxy call"
      description="Propose a proxy call on behalf of the account representing the community treasury"
      onClick={() => {
        setForwardPopup(
          <CollectiveProxyCallPopup onClose={onClose} isMember={isMember} />,
        );
      }}
    />
  );
}

export function ShibuyaCommunityCouncilQuickStart({ onClose, isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  if (!isShibuyaChain(chain) || "communityCouncil" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposalButton onClose={onClose} isMember={isMember} />
      <RejectTreasuryProposalButton onClose={onClose} isMember={isMember} />
      <DappStakingRegisterButton onClose={onClose} isMember={isMember} />
      <DappStakingUnRegisterButton onClose={onClose} isMember={isMember} />
      <CollectiveProxyCallButton onClose={onClose} isMember={isMember} />
    </QuickStart>
  );
}

export function ShibuyaCouncilQuickStart({ onClose, isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  if (!isShibuyaChain(chain) || "council" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposalButton onClose={onClose} isMember={isMember} />
      <RejectTreasuryProposalButton onClose={onClose} isMember={isMember} />
      <ExternalProposeMajorityButton onClose={onClose} isMember={isMember} />
      <ExternalProposeDefaultButton onClose={onClose} isMember={isMember} />
    </QuickStart>
  );
}
