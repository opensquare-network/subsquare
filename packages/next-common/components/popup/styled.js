import React from "react";

import styled, { css } from "styled-components";
import FlexBetween from "../styled/flexBetween";

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
  color: ${(props) => props.theme.textTertiary};
  margin-left: auto !important;
  display: flex;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export const StatusWrapper = styled.div`
  background: ${(props) => props.theme.grey100Bg};
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
      color: ${(props) => props.theme.textTertiary};
      margin-left: 2px;
    }
  }
  > div.result {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.textSecondary};
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
    color: ${(props) => props.theme.textTertiary};
    flex-grow: 1;
    text-align: center;
  }
`;

export const WarningMessage = styled.div`
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  padding: 12px 16px;
  color: ${(props) => props.theme.textSecondary};
  font-size: 14px;
  line-height: 140%;
  ${(p) =>
    p.danger &&
    css`
      color: ${(props) => props.theme.secondaryRed500};
      background: #fff1f0;
    `}
`;

export const DelegatingInfo = styled.div`
  display: flex;
  padding: 12px 16px;
  height: 64px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: ${(props) => props.theme.textSecondary};
`;

export const DelegatingValue = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  height: 38px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-top: 8px;

  > .vote {
    display: flex;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;

    > .balance {
      color: ${(props) => props.theme.textPrimary};
    }

    > .conviction {
      color: ${(props) => props.theme.textTertiary};
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
      color: ${(props) => props.theme.textSecondary};
    }

    > .proxy-addr {
      color: ${(props) => props.theme.secondarySapphire500};
      margin-left: 8px;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  > :first-child {
    background: ${(props) => props.theme.secondaryGreen500};
  }
  > * {
    flex-grow: 1 !important;
  }
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export const BalanceWrapper = styled.div`
  display: flex;
  font-size: 12px;
  line-height: 100%;
  color: ${(props) => props.theme.textSecondary};
  > :nth-child(2) {
    color: ${(props) => props.theme.textPrimary};
    font-weight: bold;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export const LabelWrapper = FlexBetween;
