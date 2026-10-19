import DotUsdLayout, { Section } from "./layout";
import { useDotUsdTabs } from "./tabs";
import DotUsdAccount from "./account";
import DotUsdInstance from "./instance";
import DotUsdExternalAssets from "./externalAssets";
import DotUsdPool from "./pool";
import DotUsdHolders from "./holders";
import DotUsdMintRecords from "./mintRecords";
import DotUsdRedeemRecords from "./redeemRecords";

function DotUsdOverview() {
  return (
    <div className="space-y-6">
      <Section
        title="Your account"
        hint="Your dotUSD balance on Asset Hub, transferable to any account"
      >
        <DotUsdAccount />
      </Section>

      <Section
        title="PSM instance"
        hint="Instance parameters read from the on-chain PSM storage"
      >
        <DotUsdInstance />
      </Section>

      <Section
        title="External assets"
        hint="Approved external assets with their circuit breaker status, weight, effective cap and fees"
      >
        <DotUsdExternalAssets />
      </Section>

      <Section title="Pool" hint="DOT/dotUSD pool of the Hub DEX">
        <DotUsdPool />
      </Section>

      <Section
        title="Holders"
        hint="dotUSD holders ordered by balance, as indexed by statescan"
      >
        <DotUsdHolders />
      </Section>
    </div>
  );
}

function DotUsdTabContent() {
  const { activeTab } = useDotUsdTabs();

  if (activeTab === "mint") {
    return <DotUsdMintRecords />;
  }

  if (activeTab === "redeem") {
    return <DotUsdRedeemRecords />;
  }

  return <DotUsdOverview />;
}

export default function DotUsdPageContent() {
  return (
    <DotUsdLayout>
      <DotUsdTabContent />
    </DotUsdLayout>
  );
}
