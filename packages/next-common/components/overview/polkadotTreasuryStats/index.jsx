import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import { AssetHubProvider } from "next-common/context/assetHub";

export default function PolkadotTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard>
        <AssetHubProvider>
          <TreasuryProvider>
            <PolkadotTreasurySummary />
          </TreasuryProvider>
        </AssetHubProvider>
      </SecondaryCard>
    </div>
  );
}
