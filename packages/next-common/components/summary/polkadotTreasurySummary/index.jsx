import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import TreasuryOnHydration from "./treasuryOnHydration";
import { cn } from "next-common/utils";
import { PolkadotTreasurySummaryProvider } from "./context";
import { TreasuryOnHydrationProvider } from "./context/treasuryOnHydration";
import FellowshipTreasuryOnAssetHub from "./fellowshipTreasuryOnAssetHub";
import Loans from "./loans";
import Bounties from "./bounties";

function PolkadotTreasurySummaryInContext() {
  return (
    <div className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <SummaryLayout className={cn("max-sm:grid-cols-1")}>
        <RelayChainTreasury />
        <TreasuryOnAssetHub />
        <TreasuryOnHydration />
        <Bounties />
        <FellowshipTreasuryOnAssetHub />
        <Loans />
      </SummaryLayout>
    </div>
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
