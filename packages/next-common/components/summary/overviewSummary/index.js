import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../../styles/componentCss";
import Flex from "../../styled/flex";
import Tooltip from "../../tooltip";
// import Content from "../cardContent";
import Summary from "../new";
import {
  SummaryGreyText,
  SummaryItem,
  SummaryItemTitle,
  SummaryItemWrapper,
} from "../styled";

const Content = styled(Flex)`
  margin-top: 4px;
`;

const TypeGroup = styled(Flex)`
  &:not(:last-child) {
    &::after {
      content: "${(p) => p.separator || "·"}";
      display: inline-block;
      margin: 0 4px;
      color: ${(p) => p.theme.textPlaceholder};
    }
  }
`;

const TypeLabel = styled(SummaryGreyText)`
  ${p_16_bold};
`;
const TypeValue = styled.span`
  margin-left: 4px;
  &:hover {
    text-decoration: underline;
  }
  ${p_16_bold};
`;

export default function OverviewSummary({ summaryData }) {
  const {
    activeBountiesCount,
    activeChildBountiesCount,
    activeExternalProposalsCount,
    activeMotionsCount,
    activePublicProposalsCount,
    activeReferendumsCount,
    activeTechCommMotionsCount,
    activeTipsCount,
    activeTreasuryProposalsCount,
  } = summaryData ?? {};

  console.log(summaryData);

  return (
    <Summary description="Due client synergize developing tentative strategic vec pushback.">
      <SummaryItemWrapper>
        <SummaryItem>
          <SummaryItemTitle>Treasury</SummaryItemTitle>
          <Content>
            <TypeGroup>
              <TypeLabel>P</TypeLabel>
              <Tooltip content="Active proposals">
                <TypeValue>{activeTreasuryProposalsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>B</TypeLabel>
              <Tooltip content="Active bounties">
                <TypeValue>{activeBountiesCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>b</TypeLabel>
              <Tooltip content="Active child bounties">
                <TypeValue>{activeChildBountiesCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>T</TypeLabel>
              <Tooltip content="Active tips">
                <TypeValue>{activeTipsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Council / T.C.</SummaryItemTitle>
          <Content>
            <TypeGroup separator="/">
              <TypeLabel>M</TypeLabel>
              <Tooltip content="Active council motions">
                <TypeValue>{activeMotionsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>M</TypeLabel>
              <Tooltip content="Active T.C. motions">
                <TypeValue>{activeTechCommMotionsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Democracy</SummaryItemTitle>
          <Content>
            <TypeGroup>
              <TypeLabel>P</TypeLabel>
              <Tooltip content="Active public proposals">
                <TypeValue>{activePublicProposalsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>E</TypeLabel>
              <Tooltip content="Active external proposals">
                <TypeValue>{activeExternalProposalsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>R</TypeLabel>
              <Tooltip content="Active referenda">
                <TypeValue>{activeReferendumsCount}</TypeValue>
              </Tooltip>
            </TypeGroup>
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Open Gov</SummaryItemTitle>
          <Content>
            <TypeGroup>
              <TypeLabel>R</TypeLabel>
              <Tooltip content="active">
                {/* <TypeValue>{activeReferendumsCount}</TypeValue> */}
              </Tooltip>
            </TypeGroup>
          </Content>
        </SummaryItem>
      </SummaryItemWrapper>
    </Summary>
  );
}
