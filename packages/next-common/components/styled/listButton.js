import styled, { css } from "styled-components";

const ListButton = styled.div`
  display: inline-flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
  &:hover {
    border-color: var(--neutral500);
  }
  svg path {
    fill: var(--textPrimary);
  }
  ${(p) =>
    p.disabled &&
    css`
      pointer-events: none;
      svg path {
        fill: var(--textDisabled);
      }
    `}
`;

export default ListButton;
