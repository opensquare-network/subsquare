import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useState, useEffect } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useMultisigContext } from "../multisigContext";
import Tooltip from "next-common/components/tooltip";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
    `}
  svg path {
    ${(p) =>
      p.disabled
        ? css`
            color: var(--textDisabled);
          `
        : css`
            color: var(--textPrimary);
          `}
  }
`;

export default function SignApprove({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { setIsNeedReload, setIsRefetchCount } = useMultisigContext();
  const { threshold, signatories, when: maybeTimepoint, callHash } = multisig;
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const otherSignatories = signatories.filter((item) => item !== address);
    const maxWeight = {
      refTime: 0,
      proofSize: 0,
    };

    return api.tx.multisig?.approveAsMulti(
      threshold,
      otherSignatories,
      maybeTimepoint,
      callHash,
      maxWeight,
    );
  }, [api, address, threshold, signatories, callHash, maybeTimepoint]);

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
      <Tooltip content="Approve">
        <SystemSignature className="w-4 h-4" onClick={doSubmit} />
      </Tooltip>
    </Wrapper>
  );
}
