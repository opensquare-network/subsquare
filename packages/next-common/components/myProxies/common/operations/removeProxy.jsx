import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import RemoveButton from "next-common/components/removeButton";
import Tooltip from "next-common/components/tooltip";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";

export default function RemoveProxy({ data }) {
  const api = useContextApi();
  const address = useRealAddress();
  const dispatch = useDispatch();

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const { delegate, proxyType, delay } = data;
    return api.tx.proxy.removeProxy(delegate, proxyType, delay);
  }, [api, address, data]);

  const onFinalized = () => {
    dispatch(newSuccessToast("Proxy removed successfully"));
    // TODO: refresh the proxy list
  };

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onFinalized,
  });

  return (
    <Tooltip content="Remove">
      <RemoveButton disabled={isSubmitting} onClick={doSubmit} />
    </Tooltip>
  );
}
