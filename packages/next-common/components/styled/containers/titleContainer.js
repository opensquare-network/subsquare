import React from "react";
import styled from "styled-components";

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
