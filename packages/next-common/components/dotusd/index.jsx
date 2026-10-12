import ListLayout from "next-common/components/layout/ListLayout";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import NoData from "next-common/components/noData";
import DotUsdProvider from "./context";
import DotUsdSummary from "./summary";
import DotUsdInstance from "./instance";

function Section({ title, hint, children }) {
  return (
    <div>
      <div className="mb-4">
        <TitleContainer>{title}</TitleContainer>
        {/* TitleContainer carries px-6, the hint needs the same inset to line up. */}
        {hint && (
          <p className="mt-2 px-6 text12Medium text-textTertiary">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export default function DotUsdPageContent() {
  return (
    <DotUsdProvider>
      <ListLayout
        title="dotUSD"
        description="Peg stability module on Polkadot Asset Hub"
        summary={<DotUsdSummary />}
      >
        <div className="space-y-6">
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
            <SecondaryCard>
              <NoData text="Approved external assets will be listed here" />
            </SecondaryCard>
          </Section>

          <Section title="Holders" hint="dotUSD holders ordered by balance">
            <SecondaryCard>
              <NoData text="Holder distribution will be listed here" />
            </SecondaryCard>
          </Section>
        </div>
      </ListLayout>
    </DotUsdProvider>
  );
}
