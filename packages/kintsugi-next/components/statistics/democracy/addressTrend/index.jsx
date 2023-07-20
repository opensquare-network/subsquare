import { StatisticsTitle } from "next-common/components/statistics/styled";
import AddressTrendChart from "./addressTrendChart";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function AddressTrend({ turnout }) {
  return (
    <SecondaryCard className="max-sm:!rounded-none">
      <StatisticsTitle className="flex justify-between items-center">
        Addr Trend
      </StatisticsTitle>

      <AddressTrendChart turnout={turnout} />
    </SecondaryCard>
  );
}
