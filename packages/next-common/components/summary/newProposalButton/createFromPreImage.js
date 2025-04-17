import { useState } from "react";
import { usePageProps } from "next-common/context/page";
import { NewPreimageButton, NewProposalFromPreimageButton } from "./common";
import { useNewPrerimageForm } from "next-common/components/preImages/newPreimagePopup";
import { useStepContainer } from "next-common/context/stepContainer";
import CircleStepper from "next-common/components/step";
import { useTxSubmissionButton } from "next-common/components/common/tx/txSubmissionButton";
import Button from "next-common/lib/button";
import { useNewProposalInnerPopupContent } from "../newProposalPopup";
const useCreatePrimage = () => {
  const {
    encodedHash,
    encodedLength,
    notePreimageTx,
    component: newPreimageForm,
  } = useNewPrerimageForm();
  const [preimage, setPreimage] = useState(null);
  const { isLoading, component } = useTxSubmissionButton({
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
  };
};

const useCreateProposal = ({ track, preimageHash, preimageLength }) => {
  const { getTxFunc, disabled, onInBlock, component } =
    useNewProposalInnerPopupContent({ track, preimageHash, preimageLength });
  const { isLoading, component: button } = useTxSubmissionButton({
    getTxFunc,
    disabled,
    onInBlock,
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
  const { canSubmit, isLoading, preimageData, form, button } =
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
            id: "provideInfo",
            label: "Provide the Info",
          },
          { id: "newPreimage", label: "New Preimage" },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={!canSubmit ? 0 : !preimageData ? 1 : 2}
        loading={isLoading || proposalLoading}
      />
      <div>{!preimageData ? form : proposalForm}</div>
      <div className="flex justify-between">
        <Button
          className="border-neutral400 hover:border-neutral500"
          onClick={goBack}
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
    disabled,
  } = useCreateProposal({
    track: period,
  });

  return (
    <>
      <CircleStepper
        steps={[
          {
            id: "provideInfo",
            label: "Provide the Info",
          },
          { id: "newReferendum", label: "New Referendum" },
        ]}
        currentStep={disabled ? 0 : 1}
        loading={proposalLoading}
      />
      <div>{proposalForm}</div>
      <div className="flex justify-between">
        <Button
          className="border-neutral400 hover:border-neutral500"
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
            title: "New Preimage",
            component: NewProposalContent,
          });
        }}
      />
    </div>
  );
}
