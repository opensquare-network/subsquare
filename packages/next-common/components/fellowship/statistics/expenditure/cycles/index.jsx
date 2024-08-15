import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import "chart.js/auto";
import CyclesChart from "./cyclesChart";
import { StatisticsTitle } from "next-common/components/statistics/styled.js";
import { LoadingContent } from "next-common/components/fellowship/statistics/common";

function BarChartContent({ value = [], loading }) {
  return <>{loading ? <LoadingContent /> : <CyclesChart values={value} />}</>;
}

export default function StatisticsCycles({ value = [], loading }) {
  return (
    <SecondaryCard>
      <div className="flex flex-col gap-[16px] h-full">
        <StatisticsTitle>Cycles</StatisticsTitle>
        <BarChartContent value={value} loading={loading} />
      </div>
    </SecondaryCard>
  );
}
