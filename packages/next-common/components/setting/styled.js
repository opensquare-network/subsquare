import React from "react";
import styled from "styled-components";
import { PrimaryCard } from "../styled/containers/primaryCard";

export const Wrapper = styled.div`
  max-width: 932px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  margin: auto;
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export const ContentWrapper = styled(PrimaryCard)`
  input {
    background-color: ${(props) => props.theme.neutral};
    border-color: ${(props) => props.theme.grey300Border};
  }
  button {
    overflow: hidden;
  }
`;

export const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
  color: ${(props) => props.theme.textPrimary};
  :not(:first-child) {
    margin-top: 16px;
  }
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  > :first-child {
    flex-grow: 1;
  }
  > :only-child {
    margin-right: 96px;
  }
  > :not(:only-child):last-child {
    width: 80px;
    margin-left: 16px;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    > :only-child {
      margin-right: 0;
    }
    > :not(:only-child):last-child {
      margin-left: 0;
      margin-top: 8px;
    }
  }
`;

export const Divider = styled.div`
  background: ${(props) => props.theme.grey200Border};
  height: 1px;
  margin: 24px 0;
`;

export const EmailVerify = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textTertiary};
  height: 38px;
  padding-right: 16px;
  font-size: 14px;
  > img {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }

  > svg {
    margin-right: 8px;
  }
`;

export const ButtonWrapper = styled.div`
  max-width: 240px;
`;
