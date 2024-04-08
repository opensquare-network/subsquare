import styled from "styled-components";
import Flex from "../../styled/flex";
import { SummaryGreyText } from "../styled";
import ActiveValue from "./activeValue";
import {
  useMenuHasCouncil,
  useMenuHasDemocracyExternal,
  useMenuHasTechComm,
  useMenuHasTreasuryBounties,
  useMenuHasTreasuryChildBounties,
  useMenuHasTreasuryTips,
} from "../../../context/chain";
import isMoonChain from "next-common/utils/isMoonChain";
import { usePageProps } from "next-common/context/page";
import CardHeader from "next-common/components/overview/centrifugeStats/cardHeader";
import {
  DetailList,
  DetailRow,
} from "next-common/components/overview/centrifugeStats/detailRow";
import { useBasicData } from "next-common/context/centrifuge/basicData";
import BigNumber from "bignumber.js";
import { formatBN } from "next-common/utils/bn";
import TokenValue from "next-common/components/overview/centrifugeStats/tokenValue";

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

function ProposalSummary() {
  return (
    <div className="flex flex-col gap-[16px]">
      <CardHeader title="All Proposals" value={0} />
      <DetailList>
        <DetailRow title="Democracy" value={<DemocracyGroupContent />} />
        <DetailRow title="Treasury" value={<TreasuryGroupContent />} />
        <DetailRow title="Council" value={<CouncilGroupContent />} />
      </DetailList>
    </div>
  );
}

function Supply() {
  const { data: { supply = {} } = {} } = useBasicData();
  const { total = 0, wrapped = 0 } = supply;

  return (
    <div className="flex flex-col gap-[16px]">
      <CardHeader
        title="Total Supply"
        value={<TokenValue value={formatBN(total)} />}
      />
      <DetailList>
        <DetailRow
          title="Native"
          value={
            <TokenValue
              value={formatBN(new BigNumber(total).minus(wrapped).toFixed())}
            />
          }
        />
        <DetailRow
          title="Wrapped"
          value={<TokenValue value={formatBN(wrapped)} />}
        />
      </DetailList>
    </div>
  );
}

export default function CentrifugeOverviewSummary() {
  return (
    <div className="grid grid-cols-3 gap-[48px]">
      <ProposalSummary />
      <Supply />
    </div>
  );
}
