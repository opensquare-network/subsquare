import React from "react";
import Contacts from "next-common/components/layout/contacts";
import Hint from "../assets/imgs/oops.svg";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  p{
    margin-top: 24px;
    font-size: 20px;
    font-weight: 700;
    line-height: 100%;
  }
  span{
    max-width: 343px;
    font-size: 14px;
    line-height: 140%;
    text-align: center;
    color: #506176;
   }
`;

export default function BrowserIncompatible() {
  return (
    <Wrapper>
      <Hint/>
      <p>Browser not Supported</p>
      <span>
        Please use Google Chrome, Microsoft Edge or Safari 14.1+ to access for good web experience.
      </span>
      <p style={{fontSize:14}}>Contact Us</p>
      <Contacts/>
    </Wrapper>
  );
}
