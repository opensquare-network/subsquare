import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import AssetHubTreasury from "./assetHubTreasury";
import HydrationTreasury from "./hydrationTreasury";
import { cn } from "next-common/utils";
import { PolkadotTreasurySummaryProvider } from "./context";
import { HydrationTreasurySummaryProvider } from "./context/hydrationTreasury";

function PolkadotTreasurySummaryInContext() {
  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <RelayChainTreasury />
      <AssetHubTreasury />
      <HydrationTreasury />
    </SummaryLayout>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasurySummaryProvider>
      <HydrationTreasurySummaryProvider>
        <PolkadotTreasurySummaryInContext />
      </HydrationTreasurySummaryProvider>
    </PolkadotTreasurySummaryProvider>
  );
}
