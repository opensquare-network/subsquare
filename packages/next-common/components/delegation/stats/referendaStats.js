import { usePageProps } from "next-common/context/page";
import Summary from "./summary";
import ReferendaDelegationStats from "next-common/components/statistics/referenda/delegationStats";

export default function ReferendaStats() {
  const { tracksStats, delegatee, tracksReferendaSummary } = usePageProps();

  return (
    <div className="space-y-6">
      <Summary {...tracksReferendaSummary?.delegation} />
      <ReferendaDelegationStats
        tracksStats={tracksStats}
        delegatee={delegatee}
      />
    </div>
  );
}
