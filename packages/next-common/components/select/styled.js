import { pretty_scroll_bar, shadow_200 } from "next-common/styles/componentCss";
import styled, { css } from "styled-components";

export const OptionsWrapper = styled.div`
  position: absolute;
  left: -1px;
  right: 0;
  top: calc(100% + 4px);
  background: var(--neutral100);
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: calc(100% + 2px);
  z-index: 999999;
  color: var(--textPrimary);

  ${(p) =>
    p.theme.isDark &&
    css`
      border: 1px solid var(--neutral300);
    `}

  ${(p) =>
    p.maxDisplayItem &&
    css`
      max-height: ${p.height * p.maxDisplayItem}px;
      overflow-y: scroll;
      ${pretty_scroll_bar};
    `}
`;
