import styled from "styled-components";
import { GreyPanel } from "./greyPanel";
import tw from "tailwind-styled-components";

export const FilterContainer = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: var(--textPrimary);
  padding-left: 24px;
  padding-right: 24px;
`;

// used for card titles, list page titles
export const TitleContainer = tw.div`
  flex flex-wrap items-center justify-between
  text16Bold text-textPrimary
  px-6
`;

export const StatisticTitleContainer = styled(TitleContainer)`
  > :first-child {
    align-items: baseline;
    gap: 8px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
  }
  > :last-child {
    display: flex;
    align-items: center;
  }
`;

// used for pages like signup, login, verification, reset password, etc
export const PageTitleContainer = styled.title`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  color: var(--textPrimary);
`;

export const NoticeWrapper = styled(GreyPanel)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  margin-bottom: 16px;
  color: var(--textSecondary);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
`;

export const SettingSection = styled.div`
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
