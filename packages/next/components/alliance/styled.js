import React from "react";
import styled, { css } from "styled-components";
import { smcss } from "next-common/utils/responsive";

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
