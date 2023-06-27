import { pretty_scroll_bar, shadow_200 } from "next-common/styles/componentCss";
import styled, { css } from "styled-components";

export const OptionsWrapper = styled.div`
  position: absolute;
  left: -1px;
  right: 0;
  top: calc(100% + 4px);
  background: ${(props) => props.theme.neutral};
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: calc(100% + 2px);
  z-index: 999999;
  color: ${(props) => props.theme.textPrimary};

  ${(p) =>
    p.theme.isDark &&
    css`
      border: 1px solid ${p.theme.grey200Border};
    `}

  ${(p) =>
    p.maxDisplayItem &&
    css`
      max-height: ${p.itemHeight * p.maxDisplayItem}px;
      overflow-y: scroll;
      ${pretty_scroll_bar};
    `}
`;
