import { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import useNewReferendumCells from "next-common/hooks/useNewReferendumCells";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { PreimageCell } from "next-common/components/preimageCell";
import SigningTip from "next-common/components/summary/newProposalQuickStart/common/signingTip";

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
  const [index, setIndex] = useState(0);

  const { cells } = useNewReferendumCells({
    notePreimageTx,
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    preimageExists,
  });

  const component = (
    <>
      <LoadingPrimaryButton
        disabled={disabled}
        loading={false}
        onClick={() => setIsOpen(true)}
      >
        {buttonText}
      </LoadingPrimaryButton>
      {isOpen && (
        <Popup title="New Referendum" onClose={() => setIsOpen(false)}>
          {cells.map((tx, i) => (
            <PreimageCell
              key={i}
              isActiveStep={index === i}
              {...tx}
              onInBlock={() => {
                tx.onInBlock();
                setIndex(index + 1);
              }}
              onClose={() => setIsOpen(false)}
              onTxSuccess={() => setIndex(index + 1)}
            />
          ))}
          <SigningTip />
        </Popup>
      )}
    </>
  );

  return {
    component,
    isLoading: index < cells.length && isOpen,
  };
}
