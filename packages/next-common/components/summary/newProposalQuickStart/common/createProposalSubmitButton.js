import { useMemo } from "react";
import { isNil } from "lodash-es";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import { useNewReferendumButton } from "next-common/hooks/useNewReferendumCells";
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
  const { hashes: preimages } = useCombinedPreimageHashes();
  const preimageExists = useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);

  const {
    isSubmitting: isSubmittingNewReferendum,
    component: newReferendumButton,
  } = useNewReferendumButton({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    buttonText: buttonText?.submitProposal || "Submit",
    disabled: disabled,
  });

  const {
    component: newReferendumMultiStepButton,
    isLoading: isLoadingNewReferendumMultiStep,
  } = useNewReferendumMultiStepButton({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    notePreimageTx,
    preimageExists,
    disabled: disabled || !notePreimageTx,
    buttonText: buttonText?.createPreimage || "Submit",
  });

  const isLoading =
    isSubmittingNewReferendum || isLoadingNewReferendumMultiStep;

  const component = preimageExists
    ? newReferendumButton
    : newReferendumMultiStepButton;

  return {
    isLoading,
    component,
    preimageExists,
    notePreimageTx,
  };
}
