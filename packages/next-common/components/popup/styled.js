import React from "react";

import styled, { css } from "styled-components";

export const VotingStatusContent = styled.div`
  > :nth-child(n + 3) {
    margin-top: 8px;
  }
`;

export const TooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export const Label = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  margin-bottom: 8px;
`;

export const VotingStatusWrapper = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  color: #9da9bb;
  margin-left: auto !important;
  display: flex;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export const StatusWrapper = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  > div.value {
    font-size: 14px;
    line-height: 100%;
    font-weight: 500;
    > span {
      color: #9da9bb;
      margin-left: 2px;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    color: #506176;
    > svg {
      margin-left: 8px;
    }
  }
  > img {
    margin: 0 auto;
  }
  > div.no-data {
    font-size: 14px;
    line-height: 100%;
    color: #9da9bb;
    flex-grow: 1;
    text-align: center;
  }
`;

export const WarningMessage = styled.div`
  background: #f6f7fa;
  border-radius: 4px;
  padding: 12px 16px;
  color: #506176;
  font-size: 14px;
  line-height: 140%;
  ${(p) =>
    p.danger &&
    css`
      color: #f44336;
      background: #fff1f0;
    `}
`;

export const DelegatingInfo = styled.div`
  display: flex;
  padding: 12px 16px;
  height: 64px;
  background: #f6f7fa;
  border-radius: 4px;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: #506176;
`;

export const DelegatingValue = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  height: 38px;
  background: #f6f7fa;
  border-radius: 4px;
  margin-top: 8px;

  > .vote {
    display: flex;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;

    > .balance {
      color: #1e2134;
    }

    > .conviction {
      color: #9da9bb;
      margin-left: 2px;
    }
  }

  > .proxy {
    display: flex;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 100%;

    > .proxy-label {
      color: #506176;
    }

    > .proxy-addr {
      color: #1f70c7;
      margin-left: 8px;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  > first-child {
    background: #4caf50;
  }
  > * {
    flex-grow: 1;
  }
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: #506176;
  > :nth-child(2) {
    color: #1e2134;
    font-weight: bold;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
