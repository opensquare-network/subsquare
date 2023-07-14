import { StatisticsTitle } from "../../styled";
import TurnoutChart from "./turnoutChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function OpenGovTurnoutSummary({ summary }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Average Turnout Pct.</StatisticsTitle>
      <TurnoutChart turnouts={summary?.trackTurnouts} />
    </SecondaryCard>
  );
}
