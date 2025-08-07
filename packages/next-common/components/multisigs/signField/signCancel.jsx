import { SystemClose } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState, useEffect } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";
import { useMultisigListFetchFunc } from "../actions/composeCallPopup/fetchMultisigList";

export default function SignCancel({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: timePoint, callHash } = multisig;
  const [isDisabled, setIsDisabled] = useState(false);
  const { ss58Format } = useChainSettings();
  const fetchMultisigListFunc = useMultisigListFetchFunc();

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const otherSignatories = signatories.filter(
      (item) => !isSameAddress(item, address),
    );

    return api.tx.multisig?.cancelAsMulti(
      threshold,
      sortAddresses(otherSignatories, ss58Format),
      timePoint,
      callHash,
    );
  }, [api, address, threshold, signatories, ss58Format, callHash, timePoint]);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onFinalized: fetchMultisigListFunc,
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(isSubmitting);
    }
  }, [isSubmitting]);

  return (
    <Tooltip content="Cancel">
      <Wrapper disabled={isDisabled} onClick={doSubmit}>
        <SystemClose role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
