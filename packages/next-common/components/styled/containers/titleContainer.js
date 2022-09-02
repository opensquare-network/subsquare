import React from "react";
import styled from "styled-components";
import Flex from "../flex";

// used for card titles, list page titles
export const TitleContainer = styled.title`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.textPrimary};
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

export const NoticeWrapper = styled(Flex)`
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.textSecondary};
`;
