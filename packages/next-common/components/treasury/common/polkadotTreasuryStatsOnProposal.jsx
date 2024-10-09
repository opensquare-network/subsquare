import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import { HydrationApiProvider } from "next-common/context/hydration";

export default function PolkadotTreasuryStatsOnProposal() {
  return (
    <div>
      <AssetHubApiProvider>
        <HydrationApiProvider>
          <TreasuryProvider>
            <PolkadotTreasurySummary />
          </TreasuryProvider>
        </HydrationApiProvider>
      </AssetHubApiProvider>
    </div>
  );
}
