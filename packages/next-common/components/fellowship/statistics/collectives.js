import { isNil } from "lodash-es";
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

function RankTableItem({ rank, count, total }) {
  const precentage = ((count / total) * 100).toFixed(2);
  return (
    <div
      key={`rank-${rank}`}
      className="flex items-center justify-between text12Medium"
    >
      <div className="flex item-center gap-[8px] grow">
        <div className="p-[2px] w-[10px] h-[10px] rounded-[2px] bg-[#D5D9E2]" />
        <span className="text-textSecondary">Rank {rank}</span>
        <span className="text-textTertiary">{count}</span>
      </div>
      <span className="text-textTertiary">{precentage}%</span>
    </div>
  );
}

function RankTable() {
  const { membersSummary: { totalMembersCount, rankDistribution } = {} } =
    usePageProps();
  if (isNil(totalMembersCount) && totalMembersCount === 0) {
    return null;
  }

  return (
    <div>
      {Object.keys(rankDistribution).map((rank) => (
        <RankTableItem
          key={`rank-${rank}`}
          rank={rank}
          count={rankDistribution[rank]}
          total={totalMembersCount}
        />
      ))}
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
