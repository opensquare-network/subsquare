import React from "react";
import styled, { css } from "styled-components";
import { smcss } from "../../utils/responsive";
import Content from "./cardContent";
import { SummaryTitle } from "./styled";

export const Wrapper = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

export const SummaryItem = styled.div`
  flex: 1;
`;

export default function SummaryItems({ items }) {
  return (
    <Wrapper>
      {items.map((item, index) => (
        <SummaryItem key={index}>
          {item.title && <SummaryTitle>{item.title}</SummaryTitle>}
          <Content>{item.content}</Content>
        </SummaryItem>
      ))}
    </Wrapper>
  );
}
