import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";

export default function AssetsTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>

      <SecondaryCard>
        <TreasuryProvider>
          <PolkadotTreasurySummary />
        </TreasuryProvider>
      </SecondaryCard>
    </div>
  );
}
