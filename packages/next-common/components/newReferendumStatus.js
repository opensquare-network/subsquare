import { useCallback, useEffect, useRef, useState } from "react";
import Popup from "./popup/wrapper/Popup";
import SigningTip from "./summary/newProposalQuickStart/common/signingTip";
import useTxSubmission from "./common/tx/useTxSubmission";
import { noop } from "lodash-es";
import { SystemYes } from "@osn/icons/subsquare";
import Loading from "./loading";
import Flex from "./styled/flex";
import Divider from "./styled/layout/divider";
import useNewReferendumCells from "next-common/hooks/useNewReferendumCells";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";

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

export function PreimageCell({
  getTxFunc,
  onInBlock = noop,
  onClose = noop,
  isActiveStep = false,
  onTxSuccess = noop,
  label,
}) {
  const isRunning = useRef(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock: () => {
      setIsSuccess(true);
      onInBlock();
      onTxSuccess?.();
    },
    onTxError: () => {
      onClose?.();
    },
  });

  const runSubmit = useCallback(async () => {
    if (getTxFunc && !isSubmitting && !isRunning.current) {
      isRunning.current = true;
      await doSubmit();
    }
  }, [doSubmit, getTxFunc, isSubmitting]);

  useEffect(() => {
    if (isActiveStep) {
      runSubmit();
    }
  }, [runSubmit, isActiveStep]);

  if (!getTxFunc) {
    return null;
  }

  let rightIcon;

  if (isSuccess) {
    rightIcon = <SystemYes className="[&>path]:stroke-theme500" />;
  }
  if (isActiveStep) {
    rightIcon = <Loading size={20} />;
  }

  return (
    <div className="flex flex-col gap-y-2.5 text-textPrimary">
      <Flex className="items-center gap-2">
        <p className="text14Medium flex-1">{label}</p>
        {rightIcon}
      </Flex>
      <Divider />
    </div>
  );
}
