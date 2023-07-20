import { StatisticsTitle } from "next-common/components/statistics/styled";
import TurnoutPercentageChart from "./turnoutPercentageChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function TurnoutStatistics({ turnout }) {
  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle>Turnout Pct.</StatisticsTitle>
      <TurnoutPercentageChart turnout={turnout} />
    </SecondaryCard>
  );
}
