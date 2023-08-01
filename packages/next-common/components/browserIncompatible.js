import React from "react";
import Hint from "../assets/imgs/oops.svg";
import styled from "styled-components";
import NextHead from "./nextHead";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p {
    margin-top: 24px;
    font-size: 20px;
    line-height: 100%;
    font-weight: 700;
  }
  span {
    max-width: 343px;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: var(--textSecondary);
  }
`;

export default function BrowserIncompatible() {
  return (
    <Wrapper>
      <NextHead
        title={"Browser not Supported"}
        desc={
          "Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for good web experience."
        }
      />
      <Hint />
      <p>Browser not Supported</p>
      <span>
        Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for
        good web experience.
      </span>
    </Wrapper>
  );
}
