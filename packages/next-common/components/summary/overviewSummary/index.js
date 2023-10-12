import React from "react";
import styled from "styled-components";
import Flex from "../../styled/flex";
import { SummaryGreyText } from "../styled";
import ActiveValue from "./activeValue";
import {
  useChainSettings,
  useMenuHasCouncil,
  useMenuHasDemocracyExternal,
  useMenuHasTechComm,
  useMenuHasTreasuryBounties,
  useMenuHasTreasuryChildBounties,
  useMenuHasTreasuryTips,
} from "../../../context/chain";
import Summary from "../v2/base";
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
      color: var(--textDisabled);
    }
  }
`;

function SummaryTypeGroup({ separator, label, tooltip, href, value }) {
  return (
    <TypeGroup separator={separator}>
      <SummaryGreyText className="text16Bold">{label}</SummaryGreyText>
      <ActiveValue tooltip={tooltip} href={href} value={value} />
    </TypeGroup>
  );
}

function OpenGovGroupContent({ summaryData }) {
  const { hasFellowship, hasReferenda } = useChainSettings();
  const { activeGov2ReferendaCount, activeFellowshipReferendaCount } =
    summaryData ?? {};

  return (
    <ContentWrapper>
      {hasReferenda && (
        <SummaryTypeGroup
          label="R"
          tooltip="Active referenda"
          href="/referenda"
          value={activeGov2ReferendaCount}
        />
      )}
      {hasFellowship && (
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
  const showTC = useMenuHasTechComm();
  const { hasFellowship, hasReferenda, noDemocracyModule } = useChainSettings();

  const items = [];
  if (hasReferenda || hasFellowship) {
    items.push({
      title: "Open Gov",
      content: <OpenGovGroupContent summaryData={summaryData} />,
    });
  }

  if (!noDemocracyModule) {
    items.push({
      title: "Democracy",
      content: <DemocracyGroupContent summaryData={summaryData} />,
    });
  }

  items.push({
    title: "Treasury",
    content: <TreasuryGroupContent summaryData={summaryData} />,
  });

  if (!noDemocracyModule) {
    items.push({
      title: `${showCouncil ? "Council" : ""}${
        showTC && showCouncil ? " / " : ""
      }${showTC ? "T.C." : ""}`,
      content: <CouncilGroupContent summaryData={summaryData} />,
    });
  }

  return (
    <Summary
      description="Active proposal numbers of various governance processes."
      items={items}
    />
  );
}
