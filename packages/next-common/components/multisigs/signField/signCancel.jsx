import { SystemClose } from "@osn/icons/subsquare";
import { Wrapper } from "./signApprove";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState, useEffect } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import Tooltip from "next-common/components/tooltip";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMultisigList10Times,
  fetchMultisigsCount10Times,
} from "../common";
import { myMultisigsSelector } from "next-common/store/reducers/multisigSlice";
import { useChain, useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";

export default function SignCancel({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: timepoint, callHash } = multisig;
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const myMultisigs = useSelector(myMultisigsSelector);
  const { page = 1 } = myMultisigs || {};
  const chain = useChain();
  const { ss58Format } = useChainSettings();

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

  const onFinalized = () => {
    setIsDisabled(false);
    dispatch(newSuccessToast("Multisig status will be updated in seconds"));
    fetchMultisigList10Times(dispatch, chain, address, page).then(() => {
      // updated 10 time, do nothing
    });
    fetchMultisigsCount10Times(dispatch, chain, address).then(() => {
      // updated 10 time, do nothing
    });
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
        <SystemClose role="button" className="w-4 h-4" onClick={doSubmit} />
      </Tooltip>
    </Wrapper>
  );
}
