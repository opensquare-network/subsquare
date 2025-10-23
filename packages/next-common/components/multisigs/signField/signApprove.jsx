import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useSignApprovePopup } from "../context/signApprovePopupContext";
import { useMultisigListFetchFunc } from "next-common/components/multisigs/actions/composeCallPopup/fetchMultisigList";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useEffect, useState, useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";

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

export function useSignApprove(multisig) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: maybeTimepoint, callHash } = multisig;
  const [isDisabled, setIsDisabled] = useState(false);
  const { ss58Format } = useChainSettings();
  const fetchMultisigListFunc = useMultisigListFetchFunc();
  const { visible, setVisible } = useSignApprovePopup();

  const getTxFunc = useCallback(() => {
    if (!api || !address) {
      return;
    }

    const otherSignatories = signatories.filter(
      (item) => !isSameAddress(item, address),
    );
    const maxWeight = {
      refTime: 0,
      proofSize: 0,
    };

    return api.tx.multisig?.approveAsMulti(
      threshold,
      sortAddresses(otherSignatories, ss58Format),
      maybeTimepoint,
      callHash,
      maxWeight,
    );
  }, [
    api,
    address,
    threshold,
    signatories,
    ss58Format,
    callHash,
    maybeTimepoint,
  ]);

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

export default function SignApprove({ multisig = {} }) {
  const { doSubmit, isDisabled } = useSignApprove(multisig);
  const { setCurrentMultisig, setVisible } = useSignApprovePopup();

  const handleClick = useCallback(() => {
    if (multisig?.call) {
      setCurrentMultisig(multisig);
      setVisible(true);
    } else {
      doSubmit();
    }
  }, [doSubmit, multisig, setCurrentMultisig, setVisible]);

  return (
    <Tooltip content="Approve">
      <Wrapper disabled={isDisabled} onClick={handleClick}>
        <SystemSignature role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
