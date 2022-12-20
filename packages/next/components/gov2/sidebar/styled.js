import styled, { css } from "styled-components";
import { mdcss } from "next-common/utils/responsive";
import { p_12_normal } from "next-common/styles/componentCss";
import ExternalLink from "next-common/components/externalLink";

const VoteButton = styled.button`
  all: unset;
  cursor: pointer;
  margin-top: 16px;
  line-height: 38px;
  background-color: ${(props) => props.theme.primaryDarkBlue};
  color: ${(props) => props.theme.textContrast};
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  border-radius: 4px;

  ${mdcss(css`
    margin: 0 24px;
  `)}
`;

const Link = styled(ExternalLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${(p) => p.theme.textTertiary};
  ${p_12_normal};

  ${mdcss(css`
    margin: 0 24px;
  `)}
`;

export { VoteButton, Link };
