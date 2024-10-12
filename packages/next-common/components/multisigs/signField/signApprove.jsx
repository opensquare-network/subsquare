import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import { useContextApi } from "next-common/context/api";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useCallback } from "react";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";

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
            fill: var(--textDisabled);
          `
        : css`
            fill: var(--textPrimary);
          `}
  }
`;

export default function SignApprove({ multisig = {} }) {
  const api = useContextApi();
  const address = useRealAddress();
  const { threshold, signatories, when: maybeTimepoint, callHash } = multisig;

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

  // TODO: reload page data
  const onInBlock = () => {};

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onFinalized: onInBlock,
  });

  return (
    <Wrapper disabled={isSubmitting}>
      <SystemSignature className="w-4 h-4" onClick={doSubmit} />
    </Wrapper>
  );
}
