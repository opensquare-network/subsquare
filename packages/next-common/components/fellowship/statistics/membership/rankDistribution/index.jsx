import RankDistributionDoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

function RankDistributionDoughnutChartHeader() {
  return <StatisticsTitle>Rank Distribution</StatisticsTitle>;
}

export default function StatisticsMembershipRankDistribution({ members = [] }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col h-full">
        <RankDistributionDoughnutChartHeader />
        <RankDistributionDoughnutChart members={members} />
      </div>
    </SecondaryCard>
  );
}
