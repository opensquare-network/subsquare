import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../../styles/componentCss";
import Flex from "../../styled/flex";
import Summary from "../new";
import {
  SummaryGreyText,
  SummaryItem,
  SummaryItemTitle,
  SummaryItemWrapper,
} from "../styled";
import ActiveValue from "./activeValue";
import {
  useMenuHasCouncil,
  useMenuHasDemocracyExternal,
  useMenuHasGov2,
  useMenuHasTechComm,
  useMenuHasTreasuryBounties,
  useMenuHasTreasuryChildBounties,
  useMenuHasTreasuryTips,
} from "../../../context/chain";

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

export default function OverviewSummary({ summaryData }) {
  const showTreasuryBounties = useMenuHasTreasuryBounties();
  const showChildBounties = useMenuHasTreasuryChildBounties();
  const showTips = useMenuHasTreasuryTips();
  const showExternal = useMenuHasDemocracyExternal();
  const showCouncil = useMenuHasCouncil();
  const showTc = useMenuHasTechComm();
  const showOpenGov = useMenuHasGov2();

  const {
    activeBountiesCount,
    activeChildBountiesCount,
    activeExternalProposalsCount,
    activeMotionsCount,
    activePublicProposalsCount,
    activeReferendaCount,
    activeTechCommMotionsCount,
    activeTipsCount,
    activeTreasuryProposalsCount,
    activeGov2ReferendaCount,
    activeFellowshipReferendaCount,
  } = summaryData ?? {};

  return (
    <Summary description="Active proposal numbers of various governance processes.">
      <SummaryItemWrapper>
        {showOpenGov && (
          <SummaryItem>
            <SummaryItemTitle>Open Gov</SummaryItemTitle>
            <Content>
              <TypeGroup>
                <TypeLabel>R</TypeLabel>
                <ActiveValue
                  tooltip="Active referenda"
                  href="/referenda"
                  value={activeGov2ReferendaCount}
                />
              </TypeGroup>
              <TypeGroup>
                <TypeLabel>F</TypeLabel>
                <ActiveValue
                  tooltip="Active fellowship referenda"
                  href="/fellowship"
                  value={activeFellowshipReferendaCount}
                />
              </TypeGroup>
            </Content>
          </SummaryItem>
        )}

        <SummaryItem>
          <SummaryItemTitle>Democracy</SummaryItemTitle>
          <Content>
            <TypeGroup>
              <TypeLabel>R</TypeLabel>
              <ActiveValue
                tooltip="Active democracy referenda"
                href="/democracy/referenda"
                value={activeReferendaCount}
              />
            </TypeGroup>

            <TypeGroup>
              <TypeLabel>P</TypeLabel>
              <ActiveValue
                tooltip="Active public proposals"
                href="/democracy/proposals"
                value={activePublicProposalsCount}
              />
            </TypeGroup>

            {showExternal && (
              <TypeGroup>
                <TypeLabel>E</TypeLabel>
                <ActiveValue
                  tooltip="Active external proposals"
                  href="/democracy/externals"
                  value={activeExternalProposalsCount}
                />
              </TypeGroup>
            )}
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>Treasury</SummaryItemTitle>
          <Content>
            <TypeGroup>
              <TypeLabel>P</TypeLabel>
              <ActiveValue
                tooltip="Active proposals"
                href="/treasury/proposals"
                value={activeTreasuryProposalsCount}
              />
            </TypeGroup>

            {showTreasuryBounties && (
              <TypeGroup>
                <TypeLabel>B</TypeLabel>
                <ActiveValue
                  tooltip="Active bounties"
                  href="/treasury/bounties"
                  value={activeBountiesCount}
                />
              </TypeGroup>
            )}

            {showChildBounties && (
              <TypeGroup>
                <TypeLabel>b</TypeLabel>
                <ActiveValue
                  tooltip="Active child bounties"
                  href="/treasury/child-bounties"
                  value={activeChildBountiesCount}
                />
              </TypeGroup>
            )}

            {showTips && (
              <TypeGroup>
                <TypeLabel>T</TypeLabel>
                <ActiveValue
                  tooltip="Active tips"
                  href="/treasury/tips"
                  value={activeTipsCount}
                />
              </TypeGroup>
            )}
          </Content>
        </SummaryItem>

        <SummaryItem>
          <SummaryItemTitle>{showCouncil && "Council / "}T.C.</SummaryItemTitle>
          <Content>
            {showCouncil && (
              <TypeGroup separator="/">
                <TypeLabel>M</TypeLabel>
                <ActiveValue
                  tooltip="Active council motions"
                  href="/council/motions"
                  value={activeMotionsCount}
                />
              </TypeGroup>
            )}

            {showTc && (
              <TypeGroup>
                <TypeLabel>P</TypeLabel>
                <ActiveValue
                  tooltip="Active T.C. proposals"
                  href="/techcomm/proposals"
                  value={activeTechCommMotionsCount}
                />
              </TypeGroup>
            )}
          </Content>
        </SummaryItem>
      </SummaryItemWrapper>
    </Summary>
  );
}
