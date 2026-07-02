import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { getSalaryAsset } from "next-common/utils/consts/getSalaryAsset";

export default function StatisticsMembershipSummaryItems({ summaryData }) {
  const { symbol } = getSalaryAsset("fellowship");
  if (!summaryData) {
    return null;
  }

  const {
    promotionTimes = "",
    retentionTimes = "",
    demotionTimes = "",
    totalActiveSalary = 0,
    totalPassiveSalary = 0,
  } = summaryData;

  return (
    <SummaryLayout className="grid grid-cols-2 gap-4">
      <SummaryItem title="Promotion">{promotionTimes}</SummaryItem>
      <SummaryItem title="Total Active Salary">
        <ValueDisplay value={totalActiveSalary} symbol={symbol} />
      </SummaryItem>
      <SummaryItem title="Demotion ">{demotionTimes}</SummaryItem>
      <SummaryItem title="Total Passive Salary">
        <ValueDisplay value={totalPassiveSalary} symbol={symbol} />
      </SummaryItem>
      <SummaryItem title="Retention">{retentionTimes}</SummaryItem>
    </SummaryLayout>
  );
}
