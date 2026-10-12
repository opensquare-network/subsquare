import ListLayout from "next-common/components/layout/ListLayout";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import NoData from "next-common/components/noData";

function Section({ title, hint, children }) {
  return (
    <div>
      <div className="mb-4">
        <TitleContainer>{title}</TitleContainer>
        {hint && <p className="mt-2 text12Medium text-textTertiary">{hint}</p>}
      </div>
      <SecondaryCard>{children}</SecondaryCard>
    </div>
  );
}

export default function DotUsdPageContent() {
  return (
    <ListLayout
      title="dotUSD"
      description="Peg Stability Module status"
    >
      <div className="space-y-6">
        <Section
          title="Overview"
          hint="Total issuance, max debt and the minting / redemption fees of the PSM instance"
        >
          <NoData text="Issuance and debt ceiling will be read from the PSM pallet" />
        </Section>

        <Section
          title="External assets"
          hint="Approved external assets with their circuit breaker status, weight, effective cap and fees"
        >
          <NoData text="Approved external assets will be listed here" />
        </Section>

        <Section
          title="Holders"
          hint="dotUSD holders ordered by balance"
        >
          <NoData text="Holder distribution will be listed here" />
        </Section>
      </div>
    </ListLayout>
  );
}
