import { useCallback, useEffect, useRef, useState } from "react";
import useTxSubmission from "./common/tx/useTxSubmission";
import { noop } from "lodash-es";
import { SystemYes } from "@osn/icons/subsquare";
import Loading from "./loading";
import Flex from "./styled/flex";
import Divider from "./styled/layout/divider";

export function PreimageCell({
  getTxFunc,
  onInBlock = noop,
  onTxError = noop,
  onSubmitted = noop,
  isActiveStep = false,
  onTxSuccess = noop,
  label,
  preimageExists,
}) {
  const isRunning = useRef(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock: (param) => {
      setIsSuccess(true);
      onInBlock(param);
      onTxSuccess?.();
    },
    onTxError,
    onSubmitted,
  });

  const runSubmit = useCallback(async () => {
    if (!isSubmitting && !isRunning.current) {
      isRunning.current = true;
      await doSubmit();
    }
  }, [doSubmit, isSubmitting]);

  useEffect(() => {
    if (preimageExists && isActiveStep) {
      setIsSuccess(true);
      onTxSuccess?.();
    }
  }, [preimageExists, onTxSuccess, isActiveStep]);

  useEffect(() => {
    if (isActiveStep && !preimageExists && getTxFunc) {
      runSubmit();
    }
  }, [runSubmit, isActiveStep, preimageExists, getTxFunc]);

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
    <div className="flex flex-col h-11 justify-around text-textPrimary">
      <Flex className="items-center gap-2">
        <p className="text14Medium flex-1">{label}</p>
        {rightIcon}
      </Flex>
      <Divider className="m-0" />
    </div>
  );
}
