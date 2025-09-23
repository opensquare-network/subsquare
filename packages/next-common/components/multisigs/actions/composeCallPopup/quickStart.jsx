import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";

import { SystemNewProposal } from "@osn/icons/subsquare";
import Transfer from "./templates/transfer";
import BatchTransfer from "./templates/batchTransfer";
import AddProxy from "./templates/addProxy";
import RemoveProxy from "./templates/removeProxy";
import { useStepContainer } from "next-common/context/stepContainer";
import ComposeCallPopupImpl from "./composeCall";

export function QuickStart() {
  const { goNext } = useStepContainer();
  return (
    <>
      <ChoiceButton
        description="Builds a call to transfer tokens"
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Transfer"
        onClick={() => {
          goNext({
            title: "Transfer",
            component: Transfer,
          });
        }}
      />
      <ChoiceButton
        description="Builds a call to batch transfer tokens"
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Batch Transfer"
        onClick={() => {
          goNext({
            title: "Batch Transfer",
            component: BatchTransfer,
          });
        }}
      />
      <ChoiceButton
        description="Builds a call to add a proxy with type"
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Add Proxy"
        onClick={() => {
          goNext({
            title: "Add Proxy",
            component: AddProxy,
          });
        }}
      />
      <ChoiceButton
        description="Builds a call to remove a proxy with type"
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Remove Proxy"
        onClick={() => {
          goNext({
            title: "Remove Proxy",
            component: RemoveProxy,
          });
        }}
      />
    </>
  );
}

export function ComposeCallSelection() {
  const { goNext } = useStepContainer();

  return (
    <ChoiceButton
      description="Create a multisig by composing a call"
      icon={<SystemNewProposal className="text-textTertiary" />}
      buttonSuffix="Compose a call"
      onClick={() => {
        goNext({
          title: "Compose a call",
          component: ComposeCallPopupImpl,
        });
      }}
    />
  );
}
