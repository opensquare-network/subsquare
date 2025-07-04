import { PromptTypes } from "next-common/components/scrollPrompt";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import KusamaTreasurySummary from "next-common/components/summary/kusamaTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import KusamaTreasuryProvider from "next-common/context/treasury/kusamaTreasury";
import dynamic from "next/dynamic";

const TotalRequestingAssets = dynamic(
  () => import("next-common/components/totalRequestingAssets"),
  {
    ssr: false,
  },
);

export default function KusamaTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard className="flex flex-col gap-y-6">
        <TreasuryProvider>
          <KusamaTreasuryProvider>
            <KusamaTreasurySummary />
          </KusamaTreasuryProvider>
        </TreasuryProvider>
        <TotalRequestingAssets styleType={PromptTypes.NEUTRAL} />
      </SecondaryCard>
    </div>
  );
}
