import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { usePageProps } from "next-common/context/page";
import DoughnutChart from "./doughnut";
import RankList from "./rankList";

function SummaryPanel() {
  const { membersSummary: { totalMembersCount = 0, rankDistribution } = {} } =
    usePageProps();
  const candidatesCount = rankDistribution[0];

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Total Members">{totalMembersCount}</SummaryItem>
        <SummaryItem title="Candidates">{candidatesCount}</SummaryItem>
        <SummaryItem title="Total Active Salary">{0}</SummaryItem>
        <SummaryItem title="Total Passive Salary">{0}</SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}

function RankDistributionPanel() {
  return (
    <SecondaryCard className="sm:w-1/2">
      <div className="text14Bold text-textPrimary">Rank Distribution</div>
      <div className="flex flex-wrap gap-6 mt-[24px]">
        <RankList />
        <DoughnutChart />
      </div>
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
