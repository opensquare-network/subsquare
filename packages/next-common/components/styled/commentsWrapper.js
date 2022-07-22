import React from "react";
import styled, { css } from "styled-components";
import { shadow_100 } from "../../styles/componentCss";
import Footer from "../layout/footer";
import Main from "../main";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = styled.div`
  background: #ffffff;
  border: 1px solid #ebeef4;
  ${shadow_100};
  border-radius: 6px;
  padding: 48px;
  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: #ffffff;
      background: #212433;
      border-color: #272a3a;
      * {
        color: #ffffff;
      }
      span.mention,
      span.mention span {
        background-color: transparent;
      }

      .editor-toolbar,
      .ql-toolbar.ql-snow,
      span.ql-formats {
        background-color: #1d1e2c !important;
        border-color: #212433 !important;
      }

      .editor-toolbar-buttons > div {
        background-color: #363a4d !important;
      }

      button:first-child {
        box-shadow: 1px 0 0 0 #363a4d !important;
      }

      button:last-child {
        box-shadow: 1px 0 0 0 #363a4d !important;
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
  const [theme] = useDarkMode();
  return <Wrapper theme={theme}>{children}</Wrapper>;
}
