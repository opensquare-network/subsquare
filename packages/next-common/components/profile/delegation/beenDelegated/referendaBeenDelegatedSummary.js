import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
export default function ReferendaBeenDelegatedSummary({
  beenDelegatedList,
  isLoading,
}) {
  const delegators = new Set();
  for (const { beenDelegated } of beenDelegatedList || []) {
    for (const delegation of beenDelegated) {
      delegators.add(delegation.delegator?.toLowerCase());
    }
  }

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="Tracks">
          <LoadableContent isLoading={isLoading}>
            {beenDelegatedList?.length || 0}
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Delegators">
          <LoadableContent isLoading={isLoading}>
            {delegators?.size || 0}
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
