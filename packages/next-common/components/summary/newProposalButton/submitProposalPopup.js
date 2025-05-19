import {
  useStepContainer,
  StepContainerProvider,
} from "next-common/context/stepContainer";
import CreateFormPreImage from "./createFromPreImage";
import Popup from "next-common/components/popup/wrapper/Popup";
import ReferendaProposalQuickStart from "./referendaProposalQuickStart";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

export default function SubmitProposalPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
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
      <CreateFormPreImage />
    </>
  );
}
