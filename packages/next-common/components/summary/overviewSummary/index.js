import React from "react";
import styled from "styled-components";
import { p_16_bold } from "../../../styles/componentCss";
import Flex from "../../styled/flex";
import { SummaryGreyText } from "../styled";
import ActiveValue from "./activeValue";
import {
  useChainSettings,
  useMenuHasCouncil,
  useMenuHasDemocracyExternal,
  useMenuHasGov2,
  useMenuHasTechComm,
  useMenuHasTreasuryBounties,
  useMenuHasTreasuryChildBounties,
  useMenuHasTreasuryTips,
} from "../../../context/chain";
import Summary from "../summaryBase";
import isMoonChain from "next-common/utils/isMoonChain";

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

function OpenGovGroupContent({ summaryData }) {
  const { noFellowship } = useChainSettings();
  const { activeGov2ReferendaCount, activeFellowshipReferendaCount } =
    summaryData ?? {};

  const hasFellowship = chain !== "polkadot";

  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="R"
        tooltip="Active referenda"
        href="/referenda"
        value={activeGov2ReferendaCount}
      />
      {!noFellowship && (
        <SummaryTypeGroup
          label="F"
          tooltip="Active fellowship referenda"
          href="/fellowship"
          value={activeFellowshipReferendaCount}
        />
      )}
    </ContentWrapper>
  );
}

function DemocracyGroupContent({ summaryData }) {
  const showExternal = useMenuHasDemocracyExternal();

  const {
    activeExternalProposalsCount,
    activePublicProposalsCount,
    activeReferendaCount,
  } = summaryData ?? {};

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

function TreasuryGroupContent({ summaryData }) {
  const showTreasuryBounties = useMenuHasTreasuryBounties();
  const showChildBounties = useMenuHasTreasuryChildBounties();
  const showTips = useMenuHasTreasuryTips();

  const {
    activeBountiesCount,
    activeChildBountiesCount,
    activeTipsCount,
    activeTreasuryProposalsCount,
  } = summaryData ?? {};

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

function CouncilGroupContent({ summaryData }) {
  const showCouncil = useMenuHasCouncil();
  const showTc = useMenuHasTechComm();

  let { activeMotionsCount, activeTechCommMotionsCount } = summaryData ?? {};

  if (isMoonChain()) {
    activeMotionsCount = summaryData?.activeMoonCouncilMotionsCount;
  }

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
  const showCouncil = useMenuHasCouncil();
  const showOpenGov = useMenuHasGov2();
  const showTC = useMenuHasTechComm();

  const items = [];
  if (showOpenGov) {
    items.push({
      title: "Open Gov",
      content: <OpenGovGroupContent summaryData={summaryData} />,
    });
  }

  items.push(
    {
      title: "Democracy",
      content: <DemocracyGroupContent summaryData={summaryData} />,
    },
    {
      title: "Treasury",
      content: <TreasuryGroupContent summaryData={summaryData} />,
    },
    {
      title: `${showCouncil ? "Council" : ""}${
        showTC && showCouncil ? " / " : ""
      }${showTC ? "T.C." : ""}`,
      content: <CouncilGroupContent summaryData={summaryData} />,
    },
  );

  return (
    <Summary
      description="Active proposal numbers of various governance processes."
      items={items}
    />
  );
}
