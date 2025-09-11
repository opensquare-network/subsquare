import styled, { css } from "styled-components";
import { GreyPanel } from "../styled/containers/greyPanel";
import tw from "tailwind-styled-components";

export const Wrapper = styled.div`
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

export const ContentWrapper = styled.div`
  background-color: var(--neutral100);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid var(--neutral300);
  background: var(--neutral100);
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
  flex-direction: column;
  gap: 16px;
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
  ${(p) =>
    p.danger
      ? css`
          color: var(--red500);
          background: var(--red100);
        `
      : css`
          color: var(--orange500);
          background: var(--orange100);
        `}
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 140%;
`;

export const InfoMessage = tw(GreyPanel)`
  text14Medium text-textSecondary px-4 py-2.5
`;
