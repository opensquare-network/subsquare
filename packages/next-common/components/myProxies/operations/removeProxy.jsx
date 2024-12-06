import { useCallback, useState, useEffect } from "react";
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
  const [isDisabled, setIsDisabled] = useState(false);

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const { delegate, proxyType, delay } = data;
    return api.tx.proxy.removeProxy(delegate, proxyType, delay);
  }, [api, address, data]);

  const onFinalized = () => {
    setIsDisabled(false);
    dispatch(newSuccessToast("Removed successfully"));
  };

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onCancelled: () => setIsDisabled(false),
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(true);
    }
  }, [isSubmitting]);

  return (
    <Tooltip content="Remove">
      <RemoveButton disabled={isDisabled} onClick={doSubmit} />
    </Tooltip>
  );
}
