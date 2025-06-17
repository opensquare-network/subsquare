import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    if (!isActiveStep || isSubmitting || isRunning.current) {
      return;
    }
    isRunning.current = true;
    if (preimageExists) {
      setIsSuccess(true);
      onTxSuccess?.();
    } else if (getTxFunc) {
      doSubmit();
    }
  }, [
    preimageExists,
    onTxSuccess,
    isActiveStep,
    getTxFunc,
    doSubmit,
    isSubmitting,
  ]);

  return (
    <div className="flex flex-col h-11 justify-around text-textPrimary">
      <Flex className="items-center gap-2">
        <p className="text14Medium flex-1">{label}</p>
        <RightStatusIcon isSuccess={isSuccess} isActiveStep={isActiveStep} />
      </Flex>
      <Divider className="m-0" />
    </div>
  );
}

function RightStatusIcon({ isSuccess, isActiveStep }) {
  if (isSuccess) {
    return <SystemYes className="[&>path]:stroke-theme500" />;
  }
  if (isActiveStep) {
    return <Loading size={20} />;
  }

  return null;
}
