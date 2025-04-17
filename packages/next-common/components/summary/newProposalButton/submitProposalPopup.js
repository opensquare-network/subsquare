import { useCallback } from "react";
import { NewProposalInnerPopup } from "../newProposalPopup";
import { usePageProps } from "next-common/context/page";
import { NewPreimageButton, NewProposalFromPreimageButton } from "./common";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ForwardPopupProvider, {
  useForwardPopupContext,
} from "next-common/context/forwardPopup";
import Popup from "next-common/components/popup/wrapper/Popup";
import { NewPreimageInnerPopup } from "next-common/components/preImages/newPreimagePopup";
import ReferendaProposalQuickStart from "./referendaProposalQuickStart";
import {
  useStepContainer,
  StepContainerProvider,
} from "next-common/context/stepContainer";

function NewPreimage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();

  const onPreimageCreated = useCallback(
    (hash, length) => {
      setForwardPopup(
        <NewProposalInnerPopup
          track={period}
          preimageHash={hash}
          preimageLength={length}
        />,
      );
    },
    [period, setForwardPopup],
  );

  return (
    <NewPreimageButton
      onClick={() =>
        setForwardPopup(<NewPreimageInnerPopup onCreated={onPreimageCreated} />)
      }
    />
  );
}

function NewProposalFromPreImage() {
  const { period } = usePageProps();
  const { setForwardPopup } = useForwardPopupContext();
  return (
    <NewProposalFromPreimageButton
      onClick={() => setForwardPopup(<NewProposalInnerPopup track={period} />)}
    />
  );
}

export default function SubmitProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ForwardPopupProvider>
        <StepContainerProvider
          list={[
            {
              title: "Submit Proposal",
              component: SubmitProposal,
            },
          ]}
        >
          <PopupContent onClose={onClose} />
        </StepContainerProvider>
      </ForwardPopupProvider>
    </SignerPopupWrapper>
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

function SubmitProposal() {
  return (
    <>
      <ReferendaProposalQuickStart />
      <div className="flex flex-col gap-[12px]">
        <h6 className="text-textPrimary text14Bold ">Create from a Preimage</h6>
        <NewPreimage />
        <NewProposalFromPreImage />
      </div>
    </>
  );
}
