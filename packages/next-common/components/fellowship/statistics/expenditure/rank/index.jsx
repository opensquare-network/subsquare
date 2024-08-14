import DoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

function DoughnutChartHeader() {
  return <StatisticsTitle>Expenditure by Rank</StatisticsTitle>;
}

export default function StatisticsExpenditureByRank() {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px] h-full">
        <DoughnutChartHeader />
        <DoughnutChart />
      </div>
    </SecondaryCard>
  );
}
