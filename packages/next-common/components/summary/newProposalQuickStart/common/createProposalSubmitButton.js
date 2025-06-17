import { useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useCombinedPreimageHashes } from "next-common/hooks/usePreimageHashes";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
// import { NewReferendumStatusPopup } from "next-common/components/newReferendumStatus";
import { useNewReferendumButton } from "next-common/hooks/useNewReferendumCells";
import dynamicPopup from "next-common/lib/dynamic/popup";

const NewReferendumStatusPopup = dynamicPopup(() =>
  import("next-common/components/newReferendumStatus"),
);

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
  const [isOpen, setIsOpen] = useState(false);
  const { hashes: preimages } = useCombinedPreimageHashes();
  const preimageExists = useMemo(() => {
    if (isNil(encodedHash) || !preimages) {
      return false;
    }
    return preimages.some(({ data: [hash] }) => hash === encodedHash);
  }, [preimages, encodedHash]);

  const { isSubmitting, component: newReferendumButton } =
    useNewReferendumButton({
      trackId,
      encodedHash,
      encodedLength,
      enactment,
      buttonText: buttonText?.createPreimage || "Submit",
      disabled: disabled || !notePreimageTx,
    });

  const component = (
    <>
      {preimageExists ? (
        <LoadingPrimaryButton
          disabled={disabled}
          onClick={() => setIsOpen(true)}
        >
          {buttonText?.submitProposal || "Submit"}
        </LoadingPrimaryButton>
      ) : (
        newReferendumButton
      )}

      {isOpen && (
        <NewReferendumStatusPopup
          onClose={() => setIsOpen(false)}
          notePreimageTx={notePreimageTx}
          trackId={trackId}
          encodedHash={encodedHash}
          encodedLength={encodedLength}
          enactment={enactment}
          preimageExists={preimageExists}
        />
      )}
    </>
  );

  return {
    isLoading: isSubmitting,
    component,
    preimageExists,
    notePreimageTx,
  };
}
