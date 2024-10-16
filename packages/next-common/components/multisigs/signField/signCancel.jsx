import { SystemClose } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useMultisigContext } from "../multisigContext";
import Tooltip from "next-common/components/tooltip";

export default function SignCancel({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { setIsNeedReload } = useMultisigContext();
  const { threshold, signatories, when: timepoint, callHash } = multisig;

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

  const onInBlock = () => {
    setIsNeedReload(true);
  };

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onFinalized: onInBlock,
  });

  return (
    <Wrapper disabled={isSubmitting}>
      <Tooltip content="Cancel">
        <SystemClose className="w-4 h-4" onClick={doSubmit} />
      </Tooltip>
    </Wrapper>
  );
}
