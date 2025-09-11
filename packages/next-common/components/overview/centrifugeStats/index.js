import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import TransactionsCard from "./transactionsCard";
import TokenHoldersCard from "./tokenHoldersCard";
import BlockRewardsCard from "./blockRewardsCard";
import GovernanceCard from "./governanceCard";
import { TreasuryProvider } from "next-common/context/treasury";

export default function CentrifugeStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Stats</TitleContainer>

      <div className="flex flex-col gap-[16px]">
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[16px]">
          <TransactionsCard />
          <TokenHoldersCard />
          <BlockRewardsCard />
          <GovernanceCard />
        </div>
        <SecondaryCard>
          <TreasuryProvider>
            <TreasurySummary />
          </TreasuryProvider>
        </SecondaryCard>
      </div>
    </div>
  );
}
