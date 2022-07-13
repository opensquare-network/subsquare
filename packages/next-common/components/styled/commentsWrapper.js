import React from "react";
import styled, { css } from "styled-components";
import { shadow_100 } from "../../styles/componentCss";

const CommentsWrapper = styled.div`
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
    `};
`;

export default CommentsWrapper;
