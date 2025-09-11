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
}) {
  const preimageExists = usePreimageExists({ encodedHash });

  const { component, isLoading } = useNewReferendumMultiStepButton({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    notePreimageTx,
    preimageExists,
    disabled: disabled || !notePreimageTx,
    buttonText: "Submit",
  });

  return {
    isLoading,
    component,
    preimageExists,
    notePreimageTx,
  };
}
