import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import TreasuryOnHydration from "./treasuryOnHydration";
import { PolkadotTreasurySummaryProvider } from "./context";
import { TreasuryOnHydrationProvider } from "./context/treasuryOnHydration";
import FellowshipTreasuryOnAssetHub from "./fellowshipTreasuryOnAssetHub";
import Loans from "./loans";
import Bounties from "./bounties";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";

function PolkadotTreasurySummaryInContext() {
  return (
    <CollapsePanel labelItem={<TotalTreasury />}>
      <RelayChainTreasury />
      <TreasuryOnAssetHub />
      <TreasuryOnHydration />
      <Bounties />
      <FellowshipTreasuryOnAssetHub />
      <Loans />
    </CollapsePanel>
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
