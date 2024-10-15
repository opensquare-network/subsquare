import { SystemSignature } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useMultisigContext } from "../multisigContext";
import Tooltip from "next-common/components/tooltip";

export default function SignSubmit({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { setIsNeedReload } = useMultisigContext();
  const { threshold, signatories, when: maybeTimepoint } = multisig;

  // TODO
  const call = null;
  const maxWeight = null;

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const otherSignatories = signatories.filter((item) => item !== address);

    return api.tx.multisig?.asMulti(
      threshold,
      otherSignatories,
      maybeTimepoint,
      call,
      maxWeight,
    );
  }, [api, address, threshold, signatories, maybeTimepoint]);

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
      <Tooltip content="Approve">
        <SystemSignature className="w-4 h-4" onClick={doSubmit} />
      </Tooltip>
    </Wrapper>
  );
}
