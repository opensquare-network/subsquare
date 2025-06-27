import { PromptTypes } from "next-common/components/scrollPrompt";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";
import dynamic from "next/dynamic";

const TotalRequestingAssets = dynamic(
  () => import("next-common/components/totalRequestingAssets"),
  {
    ssr: false,
  },
);

export default function PolkadotTreasuryStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Treasury Stats</TitleContainer>
      <SecondaryCard className="flex flex-col gap-y-6">
        <TreasuryProvider>
          <PolkadotTreasuryProvider>
            <PolkadotTreasurySummary />
          </PolkadotTreasuryProvider>
        </TreasuryProvider>
        <TotalRequestingAssets styleType={PromptTypes.NEUTRAL} />
      </SecondaryCard>
    </div>
  );
}
