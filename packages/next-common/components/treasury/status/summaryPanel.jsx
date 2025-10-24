import { useChain } from "next-common/context/chain";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import { PromptTypes } from "next-common/components/scrollPrompt";
import dynamic from "next/dynamic";
import KusamaTreasuryProvider from "next-common/context/treasury/kusamaTreasury";
import KusamaTreasurySummary from "next-common/components/summary/kusamaTreasurySummary";
import PolkadotTreasuryProvider from "next-common/context/treasury/polkadotTreasury";
import PolkadotTreasurySummary from "next-common/components/summary/polkadotTreasurySummary";
import Divider from "next-common/components/styled/layout/divider";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ApprovedProposal from "./summarys/approvedProposal";
import ApprovedSpend from "./summarys/approvedSpend";

const TotalRequestingAssets = dynamic(
  () => import("next-common/components/totalRequestingAssets"),
  {
    ssr: false,
  },
);

export default function TreasuryStatusSummaryPanel() {
  const chain = useChain();

  let summaryPanel = null;
  if (isPolkadotChain(chain)) {
    summaryPanel = (
      <PolkadotTreasuryProvider>
        <PolkadotTreasurySummary />
      </PolkadotTreasuryProvider>
    );
  } else if (isKusamaChain(chain)) {
    summaryPanel = (
      <KusamaTreasuryProvider>
        <KusamaTreasurySummary />
      </KusamaTreasuryProvider>
    );
  }

  if (!summaryPanel) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-4">
      {summaryPanel}
      <Divider className="w-full" />
      <SummaryLayout>
        <ApprovedProposal />
        <ApprovedSpend />
      </SummaryLayout>
      <TotalRequestingAssets styleType={PromptTypes.NEUTRAL} />
    </div>
  );
}
