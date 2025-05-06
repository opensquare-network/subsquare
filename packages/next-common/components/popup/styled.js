import styled, { css } from "styled-components";
import FlexBetween from "../styled/flexBetween";
import { GreyPanel } from "../styled/containers/greyPanel";

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
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 8px;
  color: var(--textPrimary);
`;

export const VotingStatusWrapper = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  color: var(--textTertiary);
  margin-left: auto !important;
  display: flex;
  > :not(:first-child) {
    margin-left: 4px;
  }
`;

export const StatusWrapper = styled(GreyPanel)`
  padding: 12px 16px;
  justify-content: space-between;
  min-height: 38px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--textPrimary);
  div.value {
    display: flex;
    > span {
      color: var(--textTertiary);
      margin-left: 2px;
    }
  }
  div.result {
    display: flex;
    align-items: center;
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
    color: var(--textTertiary);
    flex-grow: 1;
    text-align: center;
  }
`;

export const WarningMessage = styled(GreyPanel)`
  padding: 12px 16px;
  color: var(--textSecondary);
  font-size: 14px;
  line-height: 140%;
  ${(p) =>
    p.danger &&
    css`
      color: var(--red500);
      background: var(--red100);
    `}
`;

export const DelegatingInfo = styled(GreyPanel)`
  padding: 12px 16px;
  height: 64px;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  color: var(--textSecondary);
`;

export const DelegatingValue = styled(GreyPanel)`
  justify-content: space-between;
  padding: 12px 16px;
  height: 38px;
  margin-top: 8px;

  > .vote {
    display: flex;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 100%;

    > .balance {
      color: var(--textPrimary);
    }

    > .conviction {
      color: var(--textTertiary);
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
      display: flex;
      align-items: center;
      color: var(--textSecondary);
      margin-right: 8px;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  > * {
    flex-grow: 1 !important;
  }
  > :not(:first-child) {
    margin-left: 12px;
  }
`;

export const BalanceWrapper = styled.div`
  display: flex;
  font-size: 14px;
  line-height: 20px;
  color: var(--textSecondary);
  > :nth-child(2) {
    color: var(--textPrimary);
    font-weight: bold;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
`;

export const LabelWrapper = FlexBetween;
