import RankDistributionDoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

export default function StatisticsMembershipRankDistribution({ members = [] }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col h-full">
        <StatisticsTitle>Rank Distribution</StatisticsTitle>
        <RankDistributionDoughnutChart members={members} />
      </div>
    </SecondaryCard>
  );
}
