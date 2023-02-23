import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../../styles/componentCss";
import Flex from "../../styled/flex";
import { SummaryGreyText } from "../styled";
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
import Summary from "../summaryBase";

const ContentWrapper = styled.div`
  display: flex;
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

function SummaryTypeGroup({ separator, label, tooltip, href, value }) {
  return (
    <TypeGroup separator={separator}>
      <TypeLabel>{label}</TypeLabel>
      <ActiveValue tooltip={tooltip} href={href} value={value} />
    </TypeGroup>
  );
}

function OpenGovGroupContent({
  activeGov2ReferendaCount,
  activeFellowshipReferendaCount,
}) {
  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="R"
        tooltip="Active referenda"
        href="/referenda"
        value={activeGov2ReferendaCount}
      />
      <SummaryTypeGroup
        label="F"
        tooltip="Active fellowship referenda"
        href="/fellowship"
        value={activeFellowshipReferendaCount}
      />
    </ContentWrapper>
  );
}

function DemoracyGroupContent({
  activeReferendaCount,
  activePublicProposalsCount,
  showExternal,
  activeExternalProposalsCount,
}) {
  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="R"
        tooltip="Active democracy referenda"
        href="/democracy/referenda"
        value={activeReferendaCount}
      />
      <SummaryTypeGroup
        label="P"
        tooltip="Active public proposals"
        href="/democracy/proposals"
        value={activePublicProposalsCount}
      />
      {showExternal && (
        <SummaryTypeGroup
          label="E"
          tooltip="Active external proposals"
          href="/democracy/externals"
          value={activeExternalProposalsCount}
        />
      )}
    </ContentWrapper>
  );
}

function TipGroupContent({
  activeTreasuryProposalsCount,
  showTreasuryBounties,
  activeBountiesCount,
  showChildBounties,
  activeChildBountiesCount,
  showTips,
  activeTipsCount,
}) {
  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="P"
        tooltip="Active proposals"
        href="/treasury/proposals"
        value={activeTreasuryProposalsCount}
      />
      {showTreasuryBounties && (
        <SummaryTypeGroup
          label="B"
          tooltip="Active bounties"
          href="/treasury/bounties"
          value={activeBountiesCount}
        />
      )}
      {showChildBounties && (
        <SummaryTypeGroup
          label="b"
          tooltip="Active child bounties"
          href="/treasury/child-bounties"
          value={activeChildBountiesCount}
        />
      )}
      {showTips && (
        <SummaryTypeGroup
          label="T"
          tooltip="Active tips"
          href="/treasury/tips"
          value={activeTipsCount}
        />
      )}
    </ContentWrapper>
  );
}

function CouncilGroupContent({
  showCouncil,
  activeMotionsCount,
  showTc,
  activeTechCommMotionsCount,
}) {
  return (
    <ContentWrapper>
      {showCouncil && (
        <SummaryTypeGroup
          separator="/"
          label="M"
          tooltip="Active council motions"
          href="/council/motions"
          value={activeMotionsCount}
        />
      )}
      {showTc && (
        <SummaryTypeGroup
          label="P"
          tooltip="Active T.C. proposals"
          href="/techcomm/proposals"
          value={activeTechCommMotionsCount}
        />
      )}
    </ContentWrapper>
  );
}

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

  const items = [];
  if (showOpenGov) {
    items.push({
      title: "Open Gov",
      content: (
        <OpenGovGroupContent
          activeGov2ReferendaCount={activeGov2ReferendaCount}
          activeFellowshipReferendaCount={activeFellowshipReferendaCount}
        />
      ),
    });
  }

  items.push(
    {
      title: "Democracy",
      content: (
        <DemoracyGroupContent
          activeReferendaCount={activeReferendaCount}
          activePublicProposalsCount={activePublicProposalsCount}
          showExternal={showExternal}
          activeExternalProposalsCount={activeExternalProposalsCount}
        />
      ),
    },
    {
      title: "Treasury",
      content: (
        <TipGroupContent
          activeTreasuryProposalsCount={activeTreasuryProposalsCount}
          showTreasuryBounties={showTreasuryBounties}
          activeBountiesCount={activeBountiesCount}
          showChildBounties={showChildBounties}
          activeChildBountiesCount={activeChildBountiesCount}
          showTips={showTips}
          activeTipsCount={activeTipsCount}
        />
      ),
    },
    {
      title: `${showCouncil && "Council / "}T.C.`,
      content: (
        <CouncilGroupContent
          showCouncil={showCouncil}
          activeMotionsCount={activeMotionsCount}
          showTc={showTc}
          activeTechCommMotionsCount={activeTechCommMotionsCount}
        />
      ),
    }
  );

  return (
    <Summary
      description="Active proposal numbers of various governance processes."
      items={items}
    />
  );
}
