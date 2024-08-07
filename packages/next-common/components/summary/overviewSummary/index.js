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
  useMenuHasTreasurySpends,
  useMenuHasTreasuryTips,
} from "../../../context/chain";
import isMoonChain from "next-common/utils/isMoonChain";
import { usePageProps } from "next-common/context/page";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import DotSplitter from "next-common/components/dotSplitter";

const ContentWrapper = styled.div`
  display: flex;
`;
const TypeGroup = styled(Flex)`
  column-gap: 4px;
`;

function SummaryTypeGroup({ separator, label, tooltip, href, value }) {
  return (
    <TypeGroup separator={separator} className="group">
      <SummaryGreyText className="text16Bold">{label}</SummaryGreyText>
      <ActiveValue tooltip={tooltip} href={href} value={value} />
      <DotSplitter className="mx-1 ml-0 group-last:hidden" />
    </TypeGroup>
  );
}

function OpenGovGroupContent() {
  const { summary } = usePageProps();
  const {
    modules: { referenda: hasReferenda, fellowship: hasFellowship },
  } = useChainSettings();
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
  const showSpends = useMenuHasTreasurySpends();

  const { bounties, childBounties, tips, treasuryProposals, treasurySpends } =
    summary ?? {};

  return (
    <ContentWrapper>
      <SummaryTypeGroup
        label="P"
        tooltip="Active proposals"
        href="/treasury/proposals"
        value={treasuryProposals?.active || 0}
      />
      {showSpends && (
        <SummaryTypeGroup
          label="S"
          tooltip="Active spends"
          href="/treasury/spends"
          value={treasurySpends?.active || 0}
        />
      )}
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
  const {
    modules: {
      referenda: hasReferenda,
      fellowship: hasFellowship,
      democracy: hasDemocracyModule,
    },
  } = useChainSettings();

  return (
    <SummaryLayout description="Active proposal numbers of various governance processes.">
      {(hasReferenda || hasFellowship) && (
        <SummaryItem title="Open Gov">
          <OpenGovGroupContent />
        </SummaryItem>
      )}
      {hasDemocracyModule && (
        <SummaryItem title="Democracy">
          <DemocracyGroupContent />
        </SummaryItem>
      )}
      <SummaryItem title="Treasury">
        <TreasuryGroupContent />
      </SummaryItem>
      {hasDemocracyModule && (
        <SummaryItem
          title={`${showCouncil ? "Council" : ""}${
            showTC && showCouncil ? " / " : ""
          }${showTC ? "T.C." : ""}`}
        >
          <CouncilGroupContent />
        </SummaryItem>
      )}
    </SummaryLayout>
  );
}
