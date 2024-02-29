import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";

export default function ReferendaBeenDelegatedSummary({
  tracksCount,
  isLoading,
}) {
  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Tracks",
            content: (
              <LoadableContent isLoading={isLoading}>
                {tracksCount}
              </LoadableContent>
            ),
          },
        ]}
      />
    </SecondaryCard>
  );
}
