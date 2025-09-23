import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";

import {
  useStepContainer,
  StepContainerProvider,
} from "next-common/context/stepContainer";
import TemplateSelections from "./templateSelections";

export default function ComposeCallPopup({ onClose, multisig }) {
  return (
    <SignerPopupWrapper multisig={multisig}>
      <StepContainerProvider
        list={[
          {
            title: "New Multisig",
            component: TemplateSelections,
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
