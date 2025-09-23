import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useSignApprovePopup } from "../context/signApprovePopupContext";
import { useMultisigListFetchFunc } from "next-common/components/multisigs/actions/composeCallPopup/fetchMultisigList";
import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import { useEffect, useState } from "react";

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
  const fetchMultisigListFunc = useMultisigListFetchFunc();
  const { getTxFunc, setCurrentMultisig, setVisible } = useSignApprovePopup();
  const [isDisabled, setIsDisabled] = useState(false);

  const { doSubmit, isSubmitting } = useTxSubmission({
    getTxFunc: () => getTxFunc(multisig),
    onInBlock: () => {},
    onCancelled: () => {},
    onTxError: () => {},
    onFinalized: () => {
      fetchMultisigListFunc();
    },
  });

  useEffect(() => {
    if (isSubmitting) {
      setIsDisabled(isSubmitting);
    }
  }, [isSubmitting]);

  const handleClick = () => {
    if (multisig?.call) {
      setCurrentMultisig(multisig);
      setVisible(true);
    } else {
      doSubmit();
    }
  };

  return (
    <Tooltip content="Approve">
      <Wrapper disabled={isDisabled} onClick={handleClick}>
        <SystemSignature role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
