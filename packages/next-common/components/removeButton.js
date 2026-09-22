import { SystemClose } from "@osn/icons/subsquare";
import { noop } from "lodash-es";
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

// Plain ✕ button, for buttons that only trigger a dialog. Use SubmitRemoveButton
// instead when it submits a tx, so watch-only accounts are handled for you.
export default function RemoveButton({ disabled, onClick = noop }) {
  return (
    <Wrapper disabled={disabled} onClick={onClick}>
      <SystemClose width={16} height={16} />
    </Wrapper>
  );
}
