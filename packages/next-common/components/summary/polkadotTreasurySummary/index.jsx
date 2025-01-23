import TotalTreasury from "./totalTreasury";
import RelayChainTreasury from "./relayChainTreasury";
import TreasuryOnAssetHub from "./treasuryOnAssetHub";
import TreasuryOnHydration from "./treasuryOnHydration";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";
import { TreasuryOnHydrationProvider } from "./context/treasuryOnHydration";
import { MythTokenAssetsProvider } from "./context/mythTokenAssets";
import FellowshipTreasuryOnAssetHub from "./fellowshipTreasuryOnAssetHub";
import Loans from "./loans";
import Bounties from "./bounties";
import MythToken from "./mythToken";
import Ambassador from "./ambassador";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";

function PolkadotTreasurySummaryInContext() {
  return (
    <CollapsePanel labelItem={<TotalTreasury />}>
      <RelayChainTreasury />
      <TreasuryOnAssetHub />
      <TreasuryOnHydration />
      <Bounties />
      <FellowshipTreasuryOnAssetHub />
      <Ambassador />
      <Loans />
      <MythToken />
    </CollapsePanel>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <PolkadotTreasuryProvider>
      <TreasuryOnHydrationProvider>
        <MythTokenAssetsProvider>
          <PolkadotTreasurySummaryInContext />
        </MythTokenAssetsProvider>
      </TreasuryOnHydrationProvider>
    </PolkadotTreasuryProvider>
  );
}
