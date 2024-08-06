import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { usePageProps } from "next-common/context/page";

function SummaryPanel() {
  const { membersSummary: { totalMembersCount = 0 } = {} } = usePageProps();
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Members">{totalMembersCount}</SummaryItem>
        <SummaryItem title="Candidates">{0}</SummaryItem>
        <SummaryItem title="Total Active Salary">{0}</SummaryItem>
        <SummaryItem title="Total Passive Salary">{0}</SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}

function RankTable() {
  // const { membersSummary: { rankDistribution } = {} } = usePageProps();
  return (
    <div>
      <div></div>
    </div>
  );
}

function RankDistributionPanel() {
  return (
    <SecondaryCard>
      <RankTable />
    </SecondaryCard>
  );
}

export default function FellowshipCollectivesStatistics() {
  return (
    <div className="flex flex-col gap-[16px]">
      <TitleContainer>Members</TitleContainer>
      <SummaryPanel />
      <RankDistributionPanel />
    </div>
  );
}
