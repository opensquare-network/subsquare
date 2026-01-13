import TotalTreasury from "./totalTreasury";
import Treasury from "./treasury";
import TreasuryOnHydration from "./treasuryOnHydration";
import { TreasuryOnHydrationProvider } from "./context/treasuryOnHydration";
import { MythTokenAssetsProvider } from "./context/mythTokenAssets";
import FellowshipTreasuryOnAssetHub from "./fellowshipTreasuryOnAssetHub";
import Loans from "./loans";
import Bounties from "./bounties";
import MythToken from "./mythToken";
import CollapsePanel from "next-common/components/summary/polkadotTreasurySummary/common/collapsePanel";
import TreasuryStatus from "./treasuryStatus";

function PolkadotTreasurySummaryInContext() {
  return (
    <CollapsePanel className="w-[240px]" labelItem={<TotalTreasury />}>
      <Treasury />
      <TreasuryOnHydration />
      <Bounties />
      <FellowshipTreasuryOnAssetHub />
      <Loans />
      <MythToken />
      <TreasuryStatus />
    </CollapsePanel>
  );
}

export default function PolkadotTreasurySummary() {
  return (
    <TreasuryOnHydrationProvider>
      <MythTokenAssetsProvider>
        <PolkadotTreasurySummaryInContext />
      </MythTokenAssetsProvider>
    </TreasuryOnHydrationProvider>
  );
}
