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
import Summary from "..";
import isMoonChain from "next-common/utils/isMoonChain";
import { usePageProps } from "next-common/context/page";

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

function OpenGovGroupContent() {
  const { summary } = usePageProps();
  const { hasFellowship, hasReferenda } = useChainSettings();
  const { gov2Referenda, fellowshipReferenda } = summary ?? {};

  return (
    <ContentWrapper>
      {hasReferenda && (
        <SummaryTypeGroup
          label="R"
          tooltip="Active referenda"
          href="/referenda"
          value={gov2Referenda?.active || 0}
        />
      )}
      {hasFellowship && (
        <SummaryTypeGroup
          label="F"
          tooltip="Active fellowship referenda"
          href="/fellowship"
          value={fellowshipReferenda?.active || 0}
        />
      )}
    </ContentWrapper>
  );
}

function DemocracyGroupContent() {
  const { summary } = usePageProps();
  const showExternal = useMenuHasDemocracyExternal();

  const { referenda, publicProposals, externalProposals } = summary ?? {};

  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="R"
        tooltip="Active democracy referenda"
        href="/democracy/referenda"
        value={referenda?.active || 0}
      />
      <SummaryTypeGroup
        label="P"
        tooltip="Active public proposals"
        href="/democracy/proposals"
        value={publicProposals?.active || 0}
      />
      {showExternal && (
        <SummaryTypeGroup
          label="E"
          tooltip="Active external proposals"
          href="/democracy/externals"
          value={externalProposals?.active || 0}
        />
      )}
    </ContentWrapper>
  );
}

function TreasuryGroupContent() {
  const { summary } = usePageProps();
  const showTreasuryBounties = useMenuHasTreasuryBounties();
  const showChildBounties = useMenuHasTreasuryChildBounties();
  const showTips = useMenuHasTreasuryTips();

  const { bounties, childBounties, tips, treasuryProposals } = summary ?? {};

  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="P"
        tooltip="Active proposals"
        href="/treasury/proposals"
        value={treasuryProposals?.active || 0}
      />
      {showTreasuryBounties && (
        <SummaryTypeGroup
          label="B"
          tooltip="Active bounties"
          href="/treasury/bounties"
          value={bounties?.active || 0}
        />
      )}
      {showChildBounties && (
        <SummaryTypeGroup
          label="b"
          tooltip="Active child bounties"
          href="/treasury/child-bounties"
          value={childBounties?.active || 0}
        />
      )}
      {showTips && (
        <SummaryTypeGroup
          label="T"
          tooltip="Active tips"
          href="/treasury/tips"
          value={tips?.active || 0}
        />
      )}
    </ContentWrapper>
  );
}

function CouncilGroupContent() {
  const { summary } = usePageProps();
  const showCouncil = useMenuHasCouncil();
  const showTc = useMenuHasTechComm();

  const { motions, techCommMotions, moonCouncilMotions } = summary ?? {};

  return (
    <ContentWrapper>
      {showCouncil && (
        <SummaryTypeGroup
          separator="/"
          label="M"
          tooltip="Active council motions"
          href="/council/motions"
          value={
            (isMoonChain() ? moonCouncilMotions?.active : motions?.active) || 0
          }
        />
      )}
      {showTc && (
        <SummaryTypeGroup
          label="P"
          tooltip="Active T.C. proposals"
          href="/techcomm/proposals"
          value={techCommMotions?.active || 0}
        />
      )}
    </ContentWrapper>
  );
}

export default function OverviewSummary() {
  const showCouncil = useMenuHasCouncil();
  const showTC = useMenuHasTechComm();
  const { hasFellowship, hasReferenda, noDemocracyModule } = useChainSettings();

  const items = [];
  if (hasReferenda || hasFellowship) {
    items.push({
      title: "Open Gov",
      content: <OpenGovGroupContent />,
    });
  }

  if (!noDemocracyModule) {
    items.push({
      title: "Democracy",
      content: <DemocracyGroupContent />,
    });
  }

  items.push({
    title: "Treasury",
    content: <TreasuryGroupContent />,
  });

  if (!noDemocracyModule) {
    items.push({
      title: `${showCouncil ? "Council" : ""}${
        showTC && showCouncil ? " / " : ""
      }${showTC ? "T.C." : ""}`,
      content: <CouncilGroupContent />,
    });
  }

  return (
    <Summary
      description="Active proposal numbers of various governance processes."
      items={items}
    />
  );
}
