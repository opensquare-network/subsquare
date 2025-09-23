import { SystemSignature } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";
import Tooltip from "next-common/components/tooltip";
import { useSignApprovePopup } from "../context/signApprovePopupContext";

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
  const { approveMultisig, isSubmitting } = useSignApprovePopup();

  const handleClick = () => {
    approveMultisig(multisig);
  };

  return (
    <Tooltip content="Approve">
      <Wrapper disabled={isSubmitting} onClick={handleClick}>
        <SystemSignature role="button" className="w-4 h-4" />
      </Wrapper>
    </Tooltip>
  );
}
