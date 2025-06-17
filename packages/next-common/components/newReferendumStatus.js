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

export default function NewReferendumStatusPopup({
  onClose,
  notePreimageTx,
  trackId,
  encodedHash,
  encodedLength,
  enactment,
  preimageExists,
}) {
  const [index, setIndex] = useState(0);

  const { cells } = useNewReferendumCells({
    notePreimageTx,
    trackId,
    encodedHash,
    encodedLength,
    enactment,
    preimageExists,
  });

  return (
    <Popup title="New Referendum" onClose={onClose}>
      {cells.map((tx, i) => (
        <PreimageCell
          key={i}
          needRun={index === i}
          {...tx}
          onInBlock={() => {
            tx.onInBlock();
            setIndex(index + 1);
          }}
          onClose={onClose}
          onTxSuccess={() => setIndex(index + 1)}
        />
      ))}
      <SigningTip />
    </Popup>
  );
}

export function PreimageCell({
  getTxFunc,
  onInBlock = noop,
  onClose = noop,
  needRun = false,
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
    if (needRun) {
      runSubmit();
    }
  }, [runSubmit, needRun]);

  if (!getTxFunc) {
    return null;
  }

  let rightIcon;

  if (isSuccess) {
    rightIcon = <SystemYes className="[&>path]:stroke-theme500" />;
  }
  if (needRun) {
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
