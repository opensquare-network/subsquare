import { SystemClose } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
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

export default function RemoveButton({ disabled, onClick }) {
  return (
    <Wrapper disabled={disabled} onClick={onClick}>
      <SystemClose width={16} height={16} />
    </Wrapper>
  );
}
