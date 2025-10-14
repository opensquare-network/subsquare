import { useChain } from "next-common/context/chain";
import { isPolkadotChain } from "next-common/utils/chain";
import PolkadotTreasuryStatsOnProposal from "next-common/components/treasury/common/polkadotTreasuryStatsOnProposal";
import TreasurySummary from "next-common/components/summary/treasurySummary";
import { PromptTypes } from "next-common/components/scrollPrompt";
import dynamic from "next/dynamic";

const TotalRequestingAssets = dynamic(
  () => import("next-common/components/totalRequestingAssets"),
  {
    ssr: false,
  },
);

export default function TreasuryStatusSummaryPanel() {
  const chain = useChain();
  const summaryPanel = isPolkadotChain(chain) ? (
    <PolkadotTreasuryStatsOnProposal />
  ) : (
    <TreasurySummary />
  );

  return (
    <div className="flex flex-col gap-y-4">
      {summaryPanel}
      <TotalRequestingAssets styleType={PromptTypes.NEUTRAL} />
    </div>
  );
}
