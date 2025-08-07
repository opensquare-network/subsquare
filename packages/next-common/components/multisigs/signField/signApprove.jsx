import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback, useEffect, useState } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";
import { sortAddresses } from "@polkadot/util-crypto";
import { isSameAddress } from "next-common/utils";
import { useMultisigListFetchFunc } from "../actions/composeCallPopup/fetchMultisigList";

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
  const { threshold, signatories, when: maybeTimepoint, callHash } = multisig;
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
    onFinalized: fetchMultisigListFunc,
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(isSubmitting);
    }
  }, [isSubmitting]);

  return (
    <Tooltip content="Approve">
      <Wrapper disabled={isDisabled} onClick={doSubmit}>
        <SystemSignature role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
