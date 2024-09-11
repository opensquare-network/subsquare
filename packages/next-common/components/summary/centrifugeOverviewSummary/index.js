import styled from "styled-components";
import Flex from "../../styled/flex";
import { SummaryGreyText } from "../styled";
import ActiveValue from "../overviewSummary/activeValue";
import {
  useChainSettings,
  useMenuHasCouncil,
  useMenuHasDemocracyExternal,
  useMenuHasTechComm,
  useMenuHasTreasuryBounties,
  useMenuHasTreasuryChildBounties,
  useMenuHasTreasuryTips,
} from "../../../context/chain";
import { usePageProps } from "next-common/context/page";
import CardHeader from "next-common/components/overview/centrifugeStats/cardHeader";
import {
  DetailList,
  DetailRow,
} from "next-common/components/overview/centrifugeStats/detailRow";
import useCfgBasicData from "next-common/context/centrifuge/basicData";
import BigNumber from "bignumber.js";
import PriceCard from "./priceCard";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import LoadableContent from "next-common/components/common/loadableContent";

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
    <TypeGroup separator={separator} className="space-x-1">
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

  const { motions, techCommMotions } = summary ?? {};

  return (
    <ContentWrapper>
      {showCouncil && (
        <SummaryTypeGroup
          separator="/"
          label="M"
          tooltip="Active council motions"
          href="/council/motions"
          value={motions?.active || 0}
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
  const [collapsed] = useNavCollapsed();
  const { summary } = usePageProps();
  const all =
    (summary?.referenda?.active || 0) +
    (summary?.publicProposals?.active || 0) +
    (summary?.externalProposals?.active || 0) +
    (summary?.treasuryProposals?.active || 0) +
    (summary?.motions?.active || 0);

  return (
    <div
      className={cn(
        "flex flex-col gap-[16px] grow min-w-[252px]",
        collapsed && "lg:w-[252px]",
      )}
    >
      <CardHeader title="All Proposals" value={all} />
      <DetailList>
        <DetailRow title="Democracy" value={<DemocracyGroupContent />} />
        <DetailRow title="Treasury" value={<TreasuryGroupContent />} />
        <DetailRow title="Council" value={<CouncilGroupContent />} />
      </DetailList>
    </div>
  );
}

function Supply() {
  const { symbol } = useChainSettings();

  const [collapsed] = useNavCollapsed();
  const [{ data: { supply = {} } = {}, loading: isLoading }] =
    useCfgBasicData();
  const { total = 0, wrapped = 0 } = supply;

  return (
    <div
      className={cn(
        "flex flex-col gap-[16px] grow min-w-[252px]",
        collapsed && "lg:w-[252px]",
      )}
    >
      <CardHeader
        title="Total Supply"
        value={
          <LoadableContent isLoading={isLoading}>
            <ValueDisplay value={total} symbol={symbol} />
          </LoadableContent>
        }
      />
      <DetailList>
        <DetailRow
          title="Native"
          value={
            <LoadableContent isLoading={isLoading}>
              <ValueDisplay
                value={new BigNumber(total).minus(wrapped).toFixed()}
                symbol={symbol}
              />
            </LoadableContent>
          }
        />
        <DetailRow
          title="Wrapped"
          value={
            <LoadableContent isLoading={isLoading}>
              <ValueDisplay value={wrapped} symbol={symbol} />
            </LoadableContent>
          }
        />
      </DetailList>
    </div>
  );
}

export default function CentrifugeOverviewSummary() {
  const [collapsed] = useNavCollapsed();

  return (
    <div
      className={cn(
        "flex gap-[48px] max-w-full overflow-x-hidden",
        collapsed
          ? "max-md:flex-col-reverse max-md:gap-[24px]"
          : "max-lg:flex-col-reverse max-lg:gap-[24px]",
      )}
    >
      <div
        className={cn(
          "flex gap-[48px]",
          collapsed
            ? "max-sm:flex-col-reverse max-sm:gap-[24px] max-sm:py-[16px]"
            : "max-md:flex-col-reverse max-md:gap-[24px] max-md:py-[16px]",
        )}
      >
        <ProposalSummary />
        <Supply />
      </div>
      <PriceCard />
    </div>
  );
}
