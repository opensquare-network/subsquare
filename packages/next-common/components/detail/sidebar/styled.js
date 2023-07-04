import styled, { css } from "styled-components";
import { mdcss } from "next-common/utils/responsive";
import { p_12_normal } from "next-common/styles/componentCss";
import ExternalLink from "next-common/components/externalLink";

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--textTertiary);
  ${p_12_normal};

  ${mdcss(css`
    margin: 0 24px;
  `)}
`;

export { Link };

export const InlineWrapper = styled.div`
  ${mdcss(css`
    padding-left: 16px;
    padding-right: 16px;
  `)}
`;
