import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function CancelRequestJudgement({ registrarIndex }) {
  const api = useContextApi();
  const dispatch = useDispatch();
  const address = useRealAddress();

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
    <Tooltip content="Cancel">
      <RemoveButton disabled={isSubmitting} onClick={doSubmit} />
    </Tooltip>
  );
}
