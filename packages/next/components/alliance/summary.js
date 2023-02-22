import React from "react";
import styled from "styled-components";
import Content from "next-common/components/summary/cardContent";
import {
  SummaryCard,
  SummaryDescription,
  SummaryTitle,
} from "next-common/components/summary/styled";
import Divider from "next-common/components/styled/layout/divider";
import { SummaryItem, SummaryItems } from "./styled";

const Wrapper = styled(SummaryCard)`
  margin: 16px 0px;
`;

export default function Summary({ description, items = [] }) {
  return (
    <Wrapper>
      <SummaryDescription>{description}</SummaryDescription>

      <Divider margin={16} />

      <SummaryItems>
        {items.map((item, index) => (
          <SummaryItem key={index}>
            <SummaryTitle>{item.title}</SummaryTitle>
            <Content>
              <span>{item.content}</span>
            </Content>
          </SummaryItem>
        ))}
      </SummaryItems>
    </Wrapper>
  );
}
