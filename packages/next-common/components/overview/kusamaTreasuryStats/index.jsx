import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import KusamaTreasurySummary from "next-common/components/summary/kusamaTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";

export default function KusamaTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard>
        <TreasuryProvider>
          <PolkadotTreasuryProvider>
            <KusamaTreasurySummary />
          </PolkadotTreasuryProvider>
        </TreasuryProvider>
      </SecondaryCard>
    </div>
  );
}
