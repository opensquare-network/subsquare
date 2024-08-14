import StatisticsExpenditure from "next-common/components/fellowship/statistics/expenditure";
import StatisticsMembership from "next-common/components/fellowship/statistics/membership";

export default function FellowshipCollectivesStatistics() {
  return (
    <div className="flex flex-col gap-y-4">
      <StatisticsMembership />
      <StatisticsExpenditure />
    </div>
  );
}
