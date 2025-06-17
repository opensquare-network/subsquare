import {
  useNewReferendumButton,
  usePreimageExists,
} from "next-common/hooks/useNewReferendumCells";
import { useNewReferendumMultiStepButton } from "next-common/hooks/useNewReferendumMultiStepButton";

export default function CreateProposalSubmitButton({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
  disabled,
}) {
  const { component } = useCreateProposalSubmitButton({
    trackId,
    enactment,
    encodedHash,
    encodedLength,
    notePreimageTx,
    disabled,
    buttonText: {
      submitProposal: "Submit Proposal",
      createPreimage: "Create Preimage",
    },
  });
  return component;
}

export function useCreateProposalSubmitButton({
  trackId,
  enactment,
  encodedHash,
  encodedLength,
  notePreimageTx,
  disabled,
  buttonText,
}) {
  const preimageExists = usePreimageExists({ encodedHash });

  const commonProps = {
    trackId,
    encodedHash,
    encodedLength,
    enactment,
  };

  const {
    isSubmitting: isSubmittingNewReferendum,
    component: newReferendumButton,
  } = useNewReferendumButton({
    ...commonProps,
    buttonText: buttonText?.submitProposal || "Submit",
    disabled: disabled,
  });

  const {
    component: newReferendumMultiStepButton,
    isLoading: isLoadingNewReferendumMultiStep,
  } = useNewReferendumMultiStepButton({
    ...commonProps,
    notePreimageTx,
    preimageExists,
    disabled: disabled || !notePreimageTx,
    buttonText: buttonText?.createPreimage || "Submit",
  });

  const isLoading =
    isSubmittingNewReferendum || isLoadingNewReferendumMultiStep;

  const component =
    !preimageExists || notePreimageTx
      ? newReferendumMultiStepButton
      : newReferendumButton;

  return {
    isLoading,
    component,
    preimageExists,
    notePreimageTx,
  };
}
