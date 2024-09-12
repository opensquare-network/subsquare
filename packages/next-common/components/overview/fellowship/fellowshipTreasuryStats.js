import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import FellowshipTreasurySummary from "next-common/components/summary/treasurySummary/fellowshipTreasurySummary";
import { AssetHubApiProvider } from "next-common/context/assetHub";
import { TreasuryProvider } from "next-common/context/treasury";

export default function FellowshipTreasuryStats() {
  return (
    <TreasuryProvider pallet="fellowshipTreasury">
      <AssetHubApiProvider>
        <TitleContainer className="mb-4">
          Fellowship Treasury Stats
        </TitleContainer>
        <SecondaryCard>
          <FellowshipTreasurySummary />
        </SecondaryCard>
      </AssetHubApiProvider>
    </TreasuryProvider>
  );
}
