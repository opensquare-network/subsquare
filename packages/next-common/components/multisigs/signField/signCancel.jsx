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
import { useSignCancelPopup } from "../context/signCancelPopupContext";

export function useSignCancel(multisig) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: timepoint, callHash } = multisig;
  const [isDisabled, setIsDisabled] = useState(false);
  const { ss58Format } = useChainSettings();
  const fetchMultisigListFunc = useMultisigListFetchFunc();
  const { visible, setVisible } = useSignCancelPopup();

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
      timepoint,
      callHash,
    );
  }, [api, address, threshold, signatories, ss58Format, callHash, timepoint]);
  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock: () => {
      if (visible) {
        setVisible(false);
      }
      setIsDisabled(false);
    },
    onCancelled: () => setIsDisabled(false),
    onTxError: () => setIsDisabled(false),
    onFinalized: fetchMultisigListFunc,
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(isSubmitting);
    }
  }, [isSubmitting]);

  return {
    doSubmit,
    isDisabled,
  };
}

export default function SignCancel({ multisig = {} }) {
  const { doSubmit, isDisabled } = useSignCancel(multisig);
  const { setCurrentMultisig, setVisible } = useSignCancelPopup();

  const handleClick = useCallback(() => {
    if (multisig?.call) {
      setCurrentMultisig(multisig);
      setVisible(true);
    } else {
      doSubmit();
    }
  }, [doSubmit, multisig, setCurrentMultisig, setVisible]);

  return (
    <Tooltip content="Cancel">
      <Wrapper disabled={isDisabled} onClick={handleClick}>
        <SystemClose role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
