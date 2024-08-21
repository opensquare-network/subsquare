import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

export default function StatisticsMembershipSummaryItems({ summaryData }) {
  const { decimals, symbol } = useSalaryAsset();
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
        <ValueDisplay
          value={toPrecision(totalActiveSalary, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem title="Demotion ">{demotionTimes}</SummaryItem>
      <SummaryItem title="Total Passive Salary">
        <ValueDisplay
          value={toPrecision(totalPassiveSalary, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem title="Retention">{retentionTimes}</SummaryItem>
    </SummaryLayout>
  );
}
