import { StatisticsTitle } from "next-common/components/statistics/styled";
import AddressTrendChart from "./addressTrendChart";
import ChartCard from "next-common/components/styled/containers/chartCard";

export default function AddressTrend({ turnout }) {
  return (
    <ChartCard
      className="max-sm:!rounded-none"
      enlargable
      title={<StatisticsTitle className="mb-0">Vote Trend</StatisticsTitle>}
      chart={<AddressTrendChart turnout={turnout} />}
      popupChart={<AddressTrendChart height={454} turnout={turnout} />}
    />
  );
}
