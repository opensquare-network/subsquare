import TurnoutPercentageChart from "./turnoutPercentageChart";
import { StatisticsTitle } from "../styled";
import ChartCard from "next-common/components/styled/containers/chartCard";

export default function TurnoutStatistics({ turnout }) {
  return (
    <ChartCard
      className="max-sm:!rounded-none"
      enlargable
      title={<StatisticsTitle className="mb-0">Turnout Pct.</StatisticsTitle>}
      chart={<TurnoutPercentageChart turnout={turnout} />}
      popupChart={<TurnoutPercentageChart height={454} turnout={turnout} />}
    />
  );
}
