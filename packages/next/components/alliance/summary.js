import React from "react";
import styled, { css } from "styled-components";
import Content from "next-common/components/summary/cardContent";
import {
  SummaryCard,
  SummaryTitle,
} from "next-common/components/summary/styled";
import { p_14_normal } from "next-common/styles/componentCss";
import { smcss } from "next-common/utils/responsive";
import Divider from "next-common/components/styled/layout/divider";

const Wrapper = styled(SummaryCard)`
  margin: 16px 0px;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  color: ${(p) => p.theme.textTertiary};
  ${p_14_normal};
`;

const SummaryWrapper = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

const SummaryItem = styled.div`
  flex: 1;
`;

export default function AllianceSummary({ fellow, ally, retiring }) {
  return (
    <Wrapper>
      <Description>Alliance members by role.</Description>

      <Divider margin={16} />

      <SummaryWrapper>
        <SummaryItem>
          <SummaryTitle>Fellow</SummaryTitle>
          <Content>
            <span>{fellow || 0}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Ally</SummaryTitle>
          <Content>
            <span>{ally || 0}</span>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryTitle>Retiring</SummaryTitle>
          <Content>
            <span>{retiring || 0}</span>
          </Content>
        </SummaryItem>
      </SummaryWrapper>
    </Wrapper>
  );
}
