import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import { TreasuryProvider } from "next-common/context/treasury";

export default function PolkadotTreasuryStatsOnProposal() {
  return (
    <div>
      <TreasuryProvider>
        <PolkadotTreasurySummary />
      </TreasuryProvider>
    </div>
  );
}
