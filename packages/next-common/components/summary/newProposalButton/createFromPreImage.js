import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import { NewPreimageButton, NewProposalFromPreimageButton } from "./common";
import { useNewPrerimageForm } from "next-common/components/preImages/newPreimagePopup";
import { useStepContainer } from "next-common/context/stepContainer";
import CircleStepper from "next-common/components/step";
import { useTxSubmissionButton } from "next-common/components/common/tx/txSubmissionButton";
import Button from "next-common/lib/button";
import { useNewProposalInnerPopupContent } from "../newProposalPopup";
import { usePopupOnClose } from "next-common/context/popup";

const useCreatePrimage = () => {
  const {
    encodedHash,
    encodedLength,
    notePreimageTx,
    component: newPreimageForm,
  } = useNewPrerimageForm();
  const [preimage, setPreimage] = useState(null);
  const { isLoading, component } = useTxSubmissionButton({
    loadingText: "Submit",
    getTxFunc: () => notePreimageTx,
    disabled: !notePreimageTx,
    onInBlock: () => {
      setPreimage({
        encodedHash,
        encodedLength,
      });
    },
  });
  return {
    canSubmit: !!notePreimageTx,
    isLoading,
    preimageData: preimage,
    form: newPreimageForm,
    button: component,
    clearPreimageData: () => setPreimage(null),
  };
};

const useCreateProposal = ({ track, preimageHash, preimageLength }) => {
  const onClose = usePopupOnClose();
  const { getTxFunc, disabled, onInBlock, component } =
    useNewProposalInnerPopupContent({ track, preimageHash, preimageLength });
  const { isLoading, component: button } = useTxSubmissionButton({
    loadingText: "Submit",
    getTxFunc,
    disabled,
    onInBlock,
    onSubmitted: onClose,
  });

  return {
    disabled,
    isLoading,
    form: component,
    button: button,
  };
};

function NewPreimageContent() {
  const { period } = usePageProps();
  const { goBack } = useStepContainer();
  const { isLoading, preimageData, form, button, clearPreimageData } =
    useCreatePrimage();
  const {
    isLoading: proposalLoading,
    form: proposalForm,
    button: proposalButton,
  } = useCreateProposal({
    track: period,
    preimageHash: preimageData?.encodedHash,
    preimageLength: preimageData?.encodedLength,
  });
  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "templateSelect",
            label: "Template Select",
          },
          { id: "newPreimage", label: "New Preimage" },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={!preimageData ? 1 : 2}
        loading={isLoading || proposalLoading}
      />
      {!preimageData ? form : proposalForm}
      <div className="flex justify-between">
        <Button
          className={`border-neutral400 hover:border-neutral500 ${
            proposalLoading || isLoading
              ? " cursor-not-allowed text-textDisabled border-neutral300"
              : ""
          }`}
          disabled={proposalLoading || isLoading}
          onClick={() => {
            preimageData ? clearPreimageData() : goBack();
          }}
        >
          Previous
        </Button>
        {!preimageData ? button : proposalButton}
      </div>
    </>
  );
}

const NewProposalContent = () => {
  const { period } = usePageProps();
  const { goBack } = useStepContainer();
  const {
    isLoading: proposalLoading,
    form: proposalForm,
    button: proposalButton,
  } = useCreateProposal({
    track: period,
  });

  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "templateSelect",
            label: "Template Select",
          },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={1}
        loading={proposalLoading}
      />
      <>{proposalForm}</>
      <div className="bg-neutral200 rounded-lg px-4 py-2.5 text14Medium">
        After submitting the transaction, you&apos;ll be redirected to the
        referendum detail page to edit content.
      </div>
      <div className="flex justify-between">
        <Button
          className={`border-neutral400 hover:border-neutral500 ${
            proposalLoading
              ? " cursor-not-allowed text-textDisabled border-neutral300"
              : ""
          }`}
          disabled={proposalLoading}
          onClick={goBack}
        >
          Previous
        </Button>
        {proposalButton}
      </div>
    </>
  );
};

export default function CreateFormPreImage() {
  const { goNext } = useStepContainer();
  return (
    <div className="flex flex-col gap-[12px]">
      <h6 className="text-textPrimary text14Bold ">Create from a Preimage</h6>
      <NewPreimageButton
        onClick={() => {
          goNext({
            title: "New Preimage",
            component: NewPreimageContent,
          });
        }}
      />
      <NewProposalFromPreimageButton
        onClick={() => {
          goNext({
            title: "I Already Have a Preimage",
            component: NewProposalContent,
          });
        }}
      />
    </div>
  );
}
