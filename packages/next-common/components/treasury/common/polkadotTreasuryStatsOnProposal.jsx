import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";

export default function PolkadotTreasuryStatsOnProposal() {
  return (
    <div>
      <TreasuryProvider>
        <PolkadotTreasuryProvider>
          <PolkadotTreasurySummary />
        </PolkadotTreasuryProvider>
      </TreasuryProvider>
    </div>
  );
}
