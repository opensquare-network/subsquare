import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import VoteTrendChart from "./voteTrendChart";
import { StatisticsTitle } from "next-common/components/statistics/styled";

export default function VoteTrend({ turnout }) {
  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle className="flex justify-between items-center">
        Vote Trend
      </StatisticsTitle>
      <VoteTrendChart turnout={turnout} />
    </SecondaryCard>
  );
}
