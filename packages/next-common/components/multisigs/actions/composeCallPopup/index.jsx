import { ChoiceButton } from "next-common/components/summary/newProposalButton/common";
import Popup from "next-common/components/popup/wrapper/Popup";
import {
  usePopupParams,
  useSignerContext,
} from "next-common/components/popupWithSigner/context";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useState } from "react";
import { useMount } from "react-use";
import { SystemNewProposal } from "@osn/icons/subsquare";
import {
  useStepContainer,
  StepContainerProvider,
} from "next-common/context/stepContainer";
import ComposeCallTabs from "./composeCallTabs";
import ProposeWithInputHex from "./proposeWithInputHex";
import ProposeWithExtrinsic from "./proposeWithExtrinsic";
import Transfer from "./templates/transfer";
import BatchTransfer from "./templates/batchTransfer";
import AddProxy from "./templates/addProxy";
import RemoveProxy from "./templates/removeProxy";

export default function ComposeCallPopup({ onClose, multisig }) {
  return (
    <SignerPopupWrapper multisig={multisig}>
      <StepContainerProvider
        list={[
          {
            title: "New Multisig",
            component: QuickStart,
          },
        ]}
      >
        <PopupContent onClose={onClose} />
      </StepContainerProvider>
    </SignerPopupWrapper>
  );
}

export function ComposeCallPopupImpl() {
  const { multisig } = usePopupParams();
  const [formType, setFormType] = useState("set");

  const { setSelectedProxyAddress, setMultisig } = useSignerContext();

  useMount(() => {
    setSelectedProxyAddress();
    setMultisig(multisig);
  });

  return (
    <div className="flex flex-col gap-[8px]">
      <SignerWithBalance noSwitchSigner />
      <ComposeCallTabs formType={formType} setFormType={setFormType} />

      <div className={formType === "set" ? "hidden" : ""}>
        <ProposeWithInputHex />
      </div>

      <div className={formType === "input" ? "hidden" : ""}>
        <ProposeWithExtrinsic />
      </div>
    </div>
  );
}

const PopupContent = ({ onClose }) => {
  const { currentStep, closeAll } = useStepContainer();
  const { title, component: CurrentComponent } = currentStep || {};

  return (
    <Popup
      title={title}
      onClose={() => {
        onClose();
        closeAll();
      }}
    >
      <CurrentComponent />
    </Popup>
  );
};

function QuickStart() {
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
        description="Builds a call to add a proxy with a given type and delay"
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
        description="Builds a call to remove a proxy with a given type and delay"
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Remove Proxy"
        onClick={() => {
          goNext({
            title: "Remove Proxy",
            component: RemoveProxy,
          });
        }}
      />
      <ChoiceButton
        description="Allows building any Propose call manually."
        icon={<SystemNewProposal className="text-textTertiary" />}
        buttonSuffix="Propose Call"
        onClick={() => {
          goNext({
            title: "Propose Call",
            component: ComposeCallPopupImpl,
          });
        }}
      />
    </>
  );
}
