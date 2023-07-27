import { SystemMenu } from "@osn/icons/subsquare";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  display: inline-flex;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  border: 1px solid var(--neutral400);
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

export default function DetailButton({ onClick, disabled }) {
  return (
    <Wrapper disabled={disabled} onClick={onClick}>
      <SystemMenu width={16} height={16} />
    </Wrapper>
  );
}
