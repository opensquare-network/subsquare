import { useEffect, useState } from "react";
import useNewReferendumCells from "next-common/hooks/useNewReferendumCells";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import EstimatedGas from "next-common/components/estimatedGas";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";

const NewReferendumMultiStepPopup = dynamicPopup(
  () => import("next-common/components/newReferendumMultiStepPopup"),
  {
    ssr: false,
  },
);

export function useNewReferendumMultiStepButton({
  disabled,
  buttonText = "Submit",
  trackId,
  encodedHash,
  encodedLength,
  enactment,
  notePreimageTx,
  preimageExists,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [indexStep, setIndexStep] = useState(0);

  const { cells } = useNewReferendumCells({
    notePreimageTx,
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    preimageExists,
  });

  const isLoading = indexStep < cells.length && isOpen;
  const signerAccount = useSignerAccount();

  useEffect(() => {
    return () => {
      if (isOpen) {
        setIndexStep(0);
      }
    };
  }, [isOpen]);

  const component = (
    <>
      <div className="flex flex-col gap-y-2 items-end">
        <div>
          <LoadingPrimaryButton
            disabled={disabled || !notePreimageTx}
            loading={isLoading}
            onClick={() => setIsOpen(true)}
          >
            {buttonText}
          </LoadingPrimaryButton>
        </div>
        <EstimatedGas
          tx={notePreimageTx}
          address={signerAccount?.realAddress}
        />
      </div>
      {isOpen && (
        <NewReferendumMultiStepPopup
          cells={cells}
          indexStep={indexStep}
          setIndexStep={setIndexStep}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );

  return {
    component,
    isLoading,
  };
}
