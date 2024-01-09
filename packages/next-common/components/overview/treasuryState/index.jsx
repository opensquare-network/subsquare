import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TreasurySummary from "next-common/components/summary/treasurySummary";

export default function TreasuryState() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury State</TitleContainer>

      <SecondaryCard>
        <TreasurySummary />
      </SecondaryCard>
    </div>
  );
}
