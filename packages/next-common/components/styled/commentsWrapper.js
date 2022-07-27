import React from "react";
import styled, { css } from "styled-components";
import { shadow_100 } from "../../styles/componentCss";

const Wrapper = styled.div`
  border-width: 1px;
  border-style: solid;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }

  background: ${(props) => props.theme.neutral};
  color: ${(props) => props.theme.textPrimary};
  border-color: ${(props) => props.theme.grey200Border};

  ${(props) =>
    props?.theme.isDark &&
    css`
      span.mention,
      span.mention span {
        background-color: transparent;
      }
    `};
`;

export default function CommentsWrapper({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
