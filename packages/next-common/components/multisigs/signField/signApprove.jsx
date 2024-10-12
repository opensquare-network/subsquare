import { SystemSignature } from "@osn/icons/subsquare";
import { useState } from "react";
import styled, { css } from "styled-components";

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
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSignApprove = () => {
    setIsDisabled(true);
  };

  return (
    <Wrapper disabled={isDisabled}>
      <SystemSignature className="w-4 h-4" onClick={handleSignApprove} />
    </Wrapper>
  );
}
