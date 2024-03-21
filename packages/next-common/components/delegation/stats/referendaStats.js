import { usePageProps } from "next-common/context/page";
import ReferendaDelegationStats from "next-common/components/statistics/referenda/delegationStats";

export default function ReferendaStats() {
  const { tracksStats, delegatee, tracksReferendaSummary } = usePageProps();
  return (
    <ReferendaDelegationStats
      tracksStats={tracksStats}
      delegatee={delegatee}
      delegationSummary={tracksReferendaSummary?.delegation}
    />
  );
}
