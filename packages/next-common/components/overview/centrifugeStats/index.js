import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import TransactionsCard from "./transactionsCard";
import TokenHoldersCard from "./tokenHoldersCard";
import BlockRewardsCard from "./blockRewardsCard";
import GovernanceCard from "./governanceCard";
import { BasicDataProvider } from "next-common/context/centrifuge/basicData";
import { DailyExtrinsicsProvider } from "next-common/context/centrifuge/DailyExtrinsics";

export default function CentrifugeStats() {
  return (
    <div>
      <TitleContainer className="mb-4">Stats</TitleContainer>

      <div className="flex flex-col gap-[16px]">
        <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-[16px]">
          <BasicDataProvider>
            <DailyExtrinsicsProvider>
              <TransactionsCard />
              <TokenHoldersCard />
              <BlockRewardsCard />
              <GovernanceCard />
            </DailyExtrinsicsProvider>
          </BasicDataProvider>
        </div>
        <SecondaryCard>
          <TreasurySummary />
        </SecondaryCard>
      </div>
    </div>
  );
}
