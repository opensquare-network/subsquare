import TimeScopeSummary from "./timeScope";
import TotalBurntSummary from "./totalBurnt";
import NextBurnSummary from "./nextBurn";
import SpendPeriodSummary from "next-common/components/treasury/status/summarys/spendPeriod";
import SummaryLayout from "next-common/components/summary/layout/layout";

export default function TreasuryBurntSummary() {
  return (
    <SummaryLayout>
      <TotalBurntSummary />
      <TimeScopeSummary />
      <NextBurnSummary />
      <SpendPeriodSummary />
    </SummaryLayout>
  );
}
