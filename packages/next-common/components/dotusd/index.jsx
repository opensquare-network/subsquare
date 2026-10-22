import DotUsdLayout, { Section } from "./layout";
import { useDotUsdTabs } from "./tabs";
import DotUsdAccount from "./account";
import DotUsdInstance from "./instance";
import DotUsdExternalAssets from "./externalAssets";
import DotUsdPool from "./pool";
import DotUsdStats from "./dailyStats";
import DotUsdHoldersTab from "./holdersTab";
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

      <Section title="Pools" hint="All dotUSD liquidity pools on the Hub DEX">
        <DotUsdPool />
      </Section>

      <Section
        title="Trend"
        hint="dotUSD total issuance and holders since launch"
      >
        <DotUsdStats />
      </Section>
    </div>
  );
}

function DotUsdTabContent() {
  const { activeTab } = useDotUsdTabs();

  if (activeTab === "holders") {
    return <DotUsdHoldersTab />;
  }

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
