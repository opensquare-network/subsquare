import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";

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
      <Summary
        items={[
          {
            title: "Tracks",
            content: (
              <LoadableContent isLoading={isLoading}>
                {beenDelegatedList?.length || 0}
              </LoadableContent>
            ),
          },
          {
            title: "Delegators",
            content: (
              <LoadableContent isLoading={isLoading}>
                {delegators?.size || 0}
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
