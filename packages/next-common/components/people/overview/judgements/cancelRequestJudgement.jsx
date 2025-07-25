import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSmartTxToast } from "next-common/hooks/useMultisigTx";

export default function CancelRequestJudgement({ registrarIndex }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { smartToastAtInBlock } = useSmartTxToast();

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity || !address) {
      return;
    }

    return api.tx.identity.cancelRequest(registrarIndex);
  }, [api, address, registrarIndex]);

  const onInBlock = useCallback(() => {
    smartToastAtInBlock("Cancel request successfully");
  }, [smartToastAtInBlock]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
  });

  return (
    <Tooltip content="Cancel">
      <RemoveButton disabled={isSubmitting} onClick={doSubmit} />
    </Tooltip>
  );
}
