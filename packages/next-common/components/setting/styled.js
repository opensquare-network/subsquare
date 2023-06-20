import styled from "styled-components";
import { pageHomeLayoutMainContentWidth } from "../../utils/constants";
import { PrimaryCard } from "../styled/containers/primaryCard";
import { GreyPanel } from "../styled/containers/greyPanel";

export const Wrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }
  @media screen and (min-width: 1080px) {
    padding-bottom: 16px;
  }
  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export const ContentWrapper = styled(PrimaryCard)`
  input {
    background-color: var(--neutral100);
    border-color: var(--neutral400);
  }
  button {
    overflow: hidden;
  }
`;

export const Label = styled.div`
  margin-bottom: 8px;
  font-weight: bold;
  font-size: 12px;
  color: var(--textPrimary);
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

export const EmailVerify = styled.div`
  display: flex;
  align-items: center;
  color: var(--textTertiary);
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

export const WarningMessage = styled.div`
  color: var(--red500);
  background: var(--red100);
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 140%;
  margin-bottom: 16px;
`;

export const InfoMessage = styled(GreyPanel)`
  padding: 10px 16px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;

  color: var(--textSecondary);

  margin-bottom: 16px;
`;
