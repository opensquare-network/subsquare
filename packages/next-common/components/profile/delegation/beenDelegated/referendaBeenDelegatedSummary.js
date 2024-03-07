import LoadableContent from "next-common/components/common/loadableContent";
import SummaryCard from "../common/summaryCard";

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
    <SummaryCard
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
  );
}
