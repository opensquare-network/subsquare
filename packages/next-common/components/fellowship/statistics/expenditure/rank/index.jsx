import RankDoughnutChart from "./doughnutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";

export default function StatisticsExpenditureByRank({ members = [] }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col h-full">
        <StatisticsTitle>By Rank</StatisticsTitle>
        <RankDoughnutChart members={members} />
      </div>
    </SecondaryCard>
  );
}
