import { usePreimageExists } from "next-common/hooks/useNewReferendumCells";
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

  const { component: newReferendumMultiStepButton, isLoading } =
    useNewReferendumMultiStepButton({
      trackId,
      encodedHash,
      encodedLength,
      enactment,
      notePreimageTx,
      preimageExists,
      disabled: disabled || !notePreimageTx,
      buttonText: buttonText?.createPreimage || "Submit",
    });

  return {
    isLoading,
    component: newReferendumMultiStepButton,
    preimageExists,
    notePreimageTx,
  };
}
