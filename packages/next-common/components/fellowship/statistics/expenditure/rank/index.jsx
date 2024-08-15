import RankDoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

function RankDoughnutChartHeader() {
  return <StatisticsTitle>Expenditure by Rank</StatisticsTitle>;
}

export default function StatisticsExpenditureByRank({ members = [] }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col h-full">
        <RankDoughnutChartHeader />
        <RankDoughnutChart members={members} />
      </div>
    </SecondaryCard>
  );
}
