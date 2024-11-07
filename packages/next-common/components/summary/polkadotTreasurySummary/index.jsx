import SummaryLayout from "next-common/components/summary/layout/layout";
import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import TreasuryOnHydration from "./treasuryOnHydration";
import { cn } from "next-common/utils";
import { PolkadotTreasurySummaryProvider } from "./context";
import { TreasuryOnHydrationProvider } from "./context/treasuryOnHydration";
import { ForeignAssetsProvider } from "./context/foreignAssets";
import FellowshipTreasuryOnAssetHub from "./fellowshipTreasuryOnAssetHub";
import Loans from "./loans";
import Bounties from "./bounties";
import MythToken from "./mythToken";

function PolkadotTreasurySummaryInContext() {
  return (
    <SummaryLayout className={cn("max-sm:grid-cols-1")}>
      <TotalTreasury />
      <RelayChainTreasury />
      <TreasuryOnAssetHub />
      <TreasuryOnHydration />
      <Bounties />
      <FellowshipTreasuryOnAssetHub />
      <Loans />
      <MythToken />
    </SummaryLayout>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasurySummaryProvider>
      <TreasuryOnHydrationProvider>
        <ForeignAssetsProvider>
          <PolkadotTreasurySummaryInContext />
        </ForeignAssetsProvider>
      </TreasuryOnHydrationProvider>
    </PolkadotTreasurySummaryProvider>
  );
}
