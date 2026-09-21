import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useIsWatchOnly } from "next-common/context/connectedAccount";
import { WATCH_ONLY_TOOLTIP_TEXT } from "next-common/utils/watchOnly";

export default function CancelRequestJudgement({ registrarIndex }) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const address = useRealAddress();
  const isWatchOnly = useIsWatchOnly();

  const getTxFunc = useCallback(() => {
    if (!api || !api?.tx?.identity || !address) {
      return;
    }

    return api.tx.identity.cancelRequest(registrarIndex);
  }, [api, address, registrarIndex]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Cancel request successfully"));
  }, [dispatch]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
  });

  return (
    <Tooltip content={isWatchOnly ? WATCH_ONLY_TOOLTIP_TEXT : "Cancel"}>
      <RemoveButton disabled={isSubmitting || isWatchOnly} onClick={doSubmit} />
    </Tooltip>
  );
}
