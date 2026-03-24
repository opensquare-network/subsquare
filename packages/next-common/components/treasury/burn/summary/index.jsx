import TimeScopeSummary from "./timeScope";
import TotalBurnSummary from "./totalBurn";
import NextBurnSummary from "./nextBurn";
import SpendPeriodSummary from "next-common/components/treasury/status/summarys/spendPeriod";
import SummaryLayout from "next-common/components/summary/layout/layout";
import { PapiProvider } from "next-common/context/papi";

export default function TreasuryBurnSummary() {
  return (
    <PapiProvider>
      <SummaryLayout>
        <TotalBurnSummary />
        <TimeScopeSummary />
        <NextBurnSummary />
        <SpendPeriodSummary />
      </SummaryLayout>
    </PapiProvider>
  );
}
