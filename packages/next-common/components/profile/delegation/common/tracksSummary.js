import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryItems from "next-common/components/summary/summaryItems";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

export default function TracksSummary() {
  return (
    <SecondaryCard>
      <SummaryItems
        items={[
          {
            title: "Tracks",
            content: <CountSummaryContent count={0} />,
          },
        ]}
      />
    </SecondaryCard>
  );
}
