import TurnoutPercentageChart from "./turnoutPercentageChart";
import { StatisticsTitle } from "../styled";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function TurnoutStatistics({ turnout }) {
  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle>Turnout Pct.</StatisticsTitle>
      <TurnoutPercentageChart turnout={turnout} />
    </SecondaryCard>
  );
}
