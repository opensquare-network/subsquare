import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./assetHubTreasury";
import TreasuryOnHydration from "./hydrationTreasury";
import { cn } from "next-common/utils";
import { PolkadotTreasurySummaryProvider } from "./context";
import { TreasuryOnHydrationProvider } from "./context/hydrationTreasury";

function PolkadotTreasurySummaryInContext() {
  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <RelayChainTreasury />
      <TreasuryOnAssetHub />
      <TreasuryOnHydration />
    </SummaryLayout>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasurySummaryProvider>
      <TreasuryOnHydrationProvider>
        <PolkadotTreasurySummaryInContext />
      </TreasuryOnHydrationProvider>
    </PolkadotTreasurySummaryProvider>
  );
}
