import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";

export default function TreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>

      <SecondaryCard>
        <TreasuryProvider>
          <TreasurySummary />
        </TreasuryProvider>
      </SecondaryCard>
    </div>
  );
}
