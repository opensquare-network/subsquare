import DotUsdLayout, { Section } from "./layout";
import DotUsdAccount from "./account";
import DotUsdSummary from "./summary";
import DotUsdInstance from "./instance";
import DotUsdExternalAssets from "./externalAssets";
import DotUsdHolders from "./holders";

export default function DotUsdPageContent() {
  return (
    <DotUsdLayout summary={<DotUsdSummary />}>
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

        <Section
          title="Holders"
          hint="dotUSD holders ordered by balance, as indexed by statescan"
        >
          <DotUsdHolders />
        </Section>
      </div>
    </DotUsdLayout>
  );
}
