import { StatisticsTitle } from "../../styled";
import { DoughnutChart } from "./doughnetChart";
import TrackList from "./trackList";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";

export default function ReferendaSummary({ summary }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Referendum Count</StatisticsTitle>
      <div className="flex flex-wrap gap-6">
        <TrackList trackReferendaCounts={summary?.trackReferendaCounts} />
        <DoughnutChart trackReferendaCounts={summary?.trackReferendaCounts} />
      </div>
    </SecondaryCard>
  );
}
