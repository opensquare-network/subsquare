import { useChain } from "next-common/context/chain";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import TreasurySummary from "next-common/components/summary/treasurySummary";

export default function TreasurySummaryPanel() {
  const chain = useChain();
  const summaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

  return summaryPanel;
}
