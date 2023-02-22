import React from "react";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";
import { pageHomeLayoutMainContentWidth } from "next-common/utils/constants";

export const SummaryItems = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

export const SummaryItem = styled.div`
  flex: 1;
`;

export const ListWrapper = styled.div`
  max-width: ${pageHomeLayoutMainContentWidth}px;
  @media screen and (max-width: 1024px) {
    max-width: 960px;
  }

  > :not(:first-child) {
    margin-top: 16px;
  }
`;
