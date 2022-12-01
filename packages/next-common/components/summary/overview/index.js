import React from "react";
import styled, { css } from "styled-components";
import { p_14_normal, p_20_bold } from "../../../styles/componentCss";
import { smcss } from "../../../utils/responsive";
import Divider from "../../styled/layout/divider";
import Content from "../cardContent";
import { SummaryCard, SummaryTitle } from "../styled";

const Wrapper = styled(SummaryCard)`
  height: auto;
`;

const TitleGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  margin: 0;
  color: ${(p) => p.theme.textPrimary};
  ${p_20_bold};
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

export default function OverviewSummary() {
  // TODO: fetch data

  return (
    <Wrapper>
      <div>
        <TitleGroup>
          <Title>Overview</Title>
        </TitleGroup>
        <Description>
          Due client synergize developing tentative strategic vec pushback.
        </Description>

        <Divider margin={16} />

        <SummaryWrapper>
          <SummaryItem>
            <SummaryTitle>Treasury</SummaryTitle>
            <Content></Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryTitle>Council / T.C.</SummaryTitle>
            <Content></Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryTitle>Democracy</SummaryTitle>
            <Content></Content>
          </SummaryItem>

          <SummaryItem>
            <SummaryTitle>Open Gov</SummaryTitle>
            <Content></Content>
          </SummaryItem>
        </SummaryWrapper>
      </div>
    </Wrapper>
  );
}
