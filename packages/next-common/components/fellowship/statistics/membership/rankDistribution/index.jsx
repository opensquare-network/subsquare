import DoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

function DoughnutChartHeader() {
  return <StatisticsTitle>Rank Distribution</StatisticsTitle>;
}

export default function StatisticsMembershipByRank() {
  return (
    <SecondaryCard>
      <div className="flex flex-col h-full">
        <DoughnutChartHeader />
        <DoughnutChart />
      </div>
    </SecondaryCard>
  );
}
