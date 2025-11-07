import BarChart from "next-common/components/statistics/track/barChart";
import useTreasuryBurntChartData from "next-common/hooks/treasury/useTreasuryBurntChartData";

export default function TreasuryBurntChart() {
  const { chartData, options, totalWidth } = useTreasuryBurntChartData();
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
