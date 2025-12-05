import TimeScopeSummary from "./timeScope";
import TotalBurnSummary from "./totalBurn";
import NextBurnSummary from "./nextBurn";
import SpendPeriodSummary from "next-common/components/treasury/status/summarys/spendPeriod";
import SummaryLayout from "next-common/components/summary/layout/layout";

export default function TreasuryBurnSummary() {
  return (
    <SummaryLayout>
      <TotalBurnSummary />
      <TimeScopeSummary />
      <NextBurnSummary />
      <SpendPeriodSummary />
    </SummaryLayout>
  );
}
