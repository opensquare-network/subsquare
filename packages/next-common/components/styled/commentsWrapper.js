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

  .editor-toolbar,
  .ql-toolbar.ql-snow,
  span.ql-formats {
    background-color: ${(props) => props.theme.grey100Bg} !important;
    border-color: ${(props) => props.theme.neutral} !important;
  }

  .editor-toolbar-buttons > div {
    background-color: ${(props) => props.theme.grey300Border} !important;
  }

  ${(props) =>
    props?.theme.isDark &&
    css`
      span.mention,
      span.mention span {
        background-color: transparent;
      }

      button.active {
        background-color: #212433 !important;
        border-color: #212433 !important;
        color: white !important;
        box-shadow: 0 1px 0 0 #1d1e2c !important;
      }

      button svg {
        path {
          fill: rgba(255, 255, 255, 0.6);
        }
      }

      button:hover svg path {
        fill: white !important;
      }
      div {
        border-color: #363a4d !important;
      }
      div + textarea {
        background: #212433;
        border-color: #363a4d;
      }
    `};
`;

export default function CommentsWrapper({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
