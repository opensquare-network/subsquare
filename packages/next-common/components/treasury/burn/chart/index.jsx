import BarChart from "next-common/components/statistics/track/barChart";
import useTreasuryBurnChartData from "next-common/hooks/treasury/useTreasuryBurnChartData";

export default function TreasuryBurnChart() {
  const { chartData, options, totalWidth } = useTreasuryBurnChartData();
  if (!chartData) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full">
        <BarChart
          height={86}
          minWidth={totalWidth}
          noLegend={true}
          data={chartData}
          options={options}
          defaultScrollRight={true}
          hideScrollbar={true}
        />
      </div>
    </div>
  );
}
