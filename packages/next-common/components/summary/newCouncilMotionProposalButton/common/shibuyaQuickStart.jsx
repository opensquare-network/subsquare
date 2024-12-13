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

function ApproveTreasuryProposalButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Approve a treasury proposal"
      description="Approve a treasury proposal"
      onClick={() => {
        setForwardPopup(
          <ApproveTreasuryProposalInnerPopup isMember={isMember} />,
        );
      }}
    />
  );
}

function RejectTreasuryProposalButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Reject a treasury proposal"
      description="Reject a treasury proposal"
      onClick={() => {
        setForwardPopup(
          <RejectTreasuryProposalInnerPopup isMember={isMember} />,
        );
      }}
    />
  );
}

function ExternalProposeMajorityButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Democracy external propose majority"
      description="Schedule a majority-carries referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setForwardPopup(<ExternalProposeMajorityPopup isMember={isMember} />);
      }}
    />
  );
}

function ExternalProposeDefaultButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Democracy external propose default"
      description="Schedule a negative-turnout-bias referendum to be tabled next once it is legal to schedule an external referendum"
      onClick={() => {
        setForwardPopup(<ExternalProposeDefaultPopup isMember={isMember} />);
      }}
    />
  );
}

function DappStakingRegisterButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Register for dapp staking"
      description="Register a dapp on staking system to get support from the community"
      onClick={() => {
        setForwardPopup(<DappStakingRegisterPopup isMember={isMember} />);
      }}
    />
  );
}

function DappStakingUnRegisterButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Un-register from dapp staking"
      description="Un-register a dapp from the staking system"
      onClick={() => {
        setForwardPopup(<DappStakingUnRegisterPopup isMember={isMember} />);
      }}
    />
  );
}

function CollectiveProxyCallButton({ isMember }) {
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <ChoiceButton
      name="Community proxy call"
      description="Propose a proxy call on behalf of the account representing the community treasury"
      onClick={() => {
        setForwardPopup(<CollectiveProxyCallPopup isMember={isMember} />);
      }}
    />
  );
}

export function ShibuyaCommunityCouncilQuickStart({ isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  if (!isShibuyaChain(chain) || "communityCouncil" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposalButton isMember={isMember} />
      <RejectTreasuryProposalButton isMember={isMember} />
      <DappStakingRegisterButton isMember={isMember} />
      <DappStakingUnRegisterButton isMember={isMember} />
      <CollectiveProxyCallButton isMember={isMember} />
    </QuickStart>
  );
}

export function ShibuyaCouncilQuickStart({ isMember }) {
  const chain = useChain();
  const collectivePallet = useCollectivePallet();
  if (!isShibuyaChain(chain) || "council" !== collectivePallet) {
    return null;
  }

  return (
    <QuickStart>
      <ApproveTreasuryProposalButton isMember={isMember} />
      <RejectTreasuryProposalButton isMember={isMember} />
      <ExternalProposeMajorityButton isMember={isMember} />
      <ExternalProposeDefaultButton isMember={isMember} />
    </QuickStart>
  );
}
