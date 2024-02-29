import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";

export default function ReferendaBeenDelegatedSummary({ tracksCount }) {
  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Tracks",
            content: <div>{tracksCount}</div>,
          },
        ]}
      />
    </SecondaryCard>
  );
}
