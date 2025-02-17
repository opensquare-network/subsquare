import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import KusamaTreasurySummary from "next-common/components/summary/kusamaTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import KusamaTreasuryProvider from "next-common/context/treasury/kusamaTreasury";

export default function KusamaTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard>
        <TreasuryProvider>
          <KusamaTreasuryProvider>
            <KusamaTreasurySummary />
          </KusamaTreasuryProvider>
        </TreasuryProvider>
      </SecondaryCard>
    </div>
  );
}
