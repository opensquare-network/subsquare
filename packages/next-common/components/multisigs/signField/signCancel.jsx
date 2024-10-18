import { SystemClose } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState, useEffect } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useMultisigContext } from "../multisigContext";
import Tooltip from "next-common/components/tooltip";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export default function SignCancel({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { setIsNeedReload, setIsRefetchCount } = useMultisigContext();
  const { threshold, signatories, when: timepoint, callHash } = multisig;
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const otherSignatories = signatories.filter((item) => item !== address);

    return api.tx.multisig?.cancelAsMulti(
      threshold,
      otherSignatories,
      timepoint,
      callHash,
    );
  }, [api, address, threshold, signatories, callHash, timepoint]);

  const onFinalized = () => {
    setIsDisabled(false);
    setIsNeedReload(true);
    setIsRefetchCount(true);
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
  };

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onFinalized,
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(isSubmitting);
    }
  }, [isSubmitting]);

  return (
    <Wrapper disabled={isDisabled}>
      <Tooltip content="Cancel">
        <SystemClose className="w-4 h-4" onClick={doSubmit} />
      </Tooltip>
    </Wrapper>
  );
}
