import Popup from "next-common/components/popup/wrapper/Popup";
import NewReferendumCell from "./newReferendumCell";
import SigningTip from "./summary/newProposalQuickStart/common/signingTip";
import { noop } from "lodash-es";
import { useCallback } from "react";

export default function NewReferendumMultiStepPopup({
  onClose = noop,
  cells,
  indexStep,
  setIndexStep,
}) {
  const nextStep = useCallback(() => {
    setIndexStep(indexStep + 1);
  }, [indexStep, setIndexStep]);

  return (
    <Popup title="New Referendum" onClose={onClose}>
      <div className="flex flex-col">
        {cells.map((tx, i) => (
          <NewReferendumCell
            key={i}
            isActiveStep={indexStep === i}
            {...tx}
            onInBlock={(param) => {
              tx.onInBlock?.(param);
              nextStep();
            }}
            onTxError={(e) => {
              tx.onTxError?.(e);
              onClose();
            }}
            onTxSuccess={() => {
              tx.onTxSuccess?.();
              nextStep();
            }}
          />
        ))}
      </div>
      <SigningTip />
    </Popup>
  );
}
