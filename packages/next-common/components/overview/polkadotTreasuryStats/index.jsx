import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import { HydrationApiProvider } from "next-common/context/hydration";

export default function PolkadotTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard>
        <AssetHubApiProvider>
          <HydrationApiProvider>
            <TreasuryProvider>
              <PolkadotTreasurySummary />
            </TreasuryProvider>
          </HydrationApiProvider>
        </AssetHubApiProvider>
      </SecondaryCard>
    </div>
  );
}
