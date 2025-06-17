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
