import { useCallback, useState, useEffect } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import SubmitRemoveButton from "next-common/components/common/tx/submitRemoveButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { noop } from "lodash-es";

export default function RemoveProxy({ data, onSubmitted = noop }) {
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
    onSubmitted,
    onFinalized,
    onCancelled: () => setIsDisabled(false),
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(true);
    }
  }, [isSubmitting]);

  return (
    <SubmitRemoveButton
      tooltip="Remove"
      disabled={isDisabled}
      onClick={doSubmit}
    />
  );
}
