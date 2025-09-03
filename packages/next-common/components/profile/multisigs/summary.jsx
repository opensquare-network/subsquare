import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

export default function MultisigSummary({
  isLoading = false,
  threshold,
  signatories,
}) {
  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Threshold">
          <LoadableContent isLoading={isLoading}>
            {threshold || 0}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Signatories">
          <LoadableContent isLoading={isLoading}>
            {signatories?.length || 0}
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
