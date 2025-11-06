import TimeScopeSummary from "./timeScope";
import TotalBurntSummary from "./totalBurnt";
import NextBurnSummary from "./nextBurn";
import SummaryLayout from "next-common/components/summary/layout/layout";

export default function TreasuryBurntSummary() {
  return (
    <SummaryLayout>
      <TotalBurntSummary />
      <TimeScopeSummary />
      <NextBurnSummary />
    </SummaryLayout>
  );
}
