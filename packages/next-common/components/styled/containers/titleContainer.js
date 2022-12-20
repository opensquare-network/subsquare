import styled from "styled-components";
import Flex from "../flex";
import { GreyPanel } from "./greyPanel";

// used for card titles, list page titles
export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.textPrimary};
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
  color: ${(props) => props.theme.textPrimary};
`;

export const NoticeWrapper = styled(GreyPanel)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  margin-bottom: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
`;
