import { useForwardPopupContext } from "next-common/context/forwardPopup";
import { ChoiceButton } from "../../newProposalButton/common";
import ApproveTreasuryProposalInnerPopup from "../approveTreasuryProposalInnerPopup";
import CollectiveProxyCallPopup from "../collectiveProxyCallPopup";
import DappStakingRegisterPopup from "../dappStakingRegisterPopup";
import DappStakingUnRegisterPopup from "../dappStakingUnRegisterPopup";
import ExternalProposeDefaultPopup from "../externalProposeDefaultPopup";
import ExternalProposeMajorityPopup from "../externalProposeMajorityPopup";
import RejectTreasuryProposalInnerPopup from "../rejectTreasuryProposalInnerPopup";

export function ApproveTreasuryProposal({ isMember }) {
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

export function RejectTreasuryProposal({ isMember }) {
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

export function ExternalProposeMajority({ isMember }) {
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

export function ExternalProposeDefault({ isMember }) {
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

export function DappStakingRegister({ isMember }) {
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

export function DappStakingUnRegister({ isMember }) {
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

export function CollectiveProxyCall({ isMember }) {
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
