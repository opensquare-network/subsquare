import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import MultiAssetsTreasury from "./multiAssetsTreasury";
import FellowshipTreasury from "./fellowshipTreasury";
import { cn } from "next-common/utils";
import { PolkadotTreasurySummaryProvider } from "./context";

function PolkadotTreasurySummaryInContext() {
  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <RelayChainTreasury />
      <MultiAssetsTreasury />
      <FellowshipTreasury />
    </SummaryLayout>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasurySummaryProvider>
      <PolkadotTreasurySummaryInContext />
    </PolkadotTreasurySummaryProvider>
  );
}
