import React from "react";
import { StatisticsTitle } from "next-common/components/statistics/styled";
import { useNavCollapsed } from "next-common/context/nav";
import { cn } from "next-common/utils";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import {
  Wrapper,
  TrackListItem,
} from "next-common/components/statistics/referenda/summary/trackList";
import { DoughnutChart } from "next-common/components/statistics/referenda/summary/doughnetChart";
import { FellowshipTrackColors } from "next-common/components/statistics/referenda/summary/colors";

function TrackList({ trackReferendaCounts }) {
  return (
    <Wrapper>
      {trackReferendaCounts?.map((item, index) => (
        <TrackListItem
          key={index}
          color={FellowshipTrackColors[item.name]}
          item={item}
        />
      ))}
    </Wrapper>
  );
}

function ReferendaSummary({ summary }) {
  return (
    <SecondaryCard>
      <StatisticsTitle>Referendum Count</StatisticsTitle>
      <div className="flex flex-wrap gap-6">
        <TrackList trackReferendaCounts={summary?.trackReferendaCounts} />
        <DoughnutChart
          trackReferendaCounts={summary?.trackReferendaCounts}
          trackColors={FellowshipTrackColors}
        />
      </div>
    </SecondaryCard>
  );
}

export default function FellowshipReferendaStatistics({ summary }) {
  const [navCollapsed] = useNavCollapsed();
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4",
        !navCollapsed ? "max-md:grid-cols-1" : "max-sm:grid-cols-1",
      )}
    >
      <ReferendaSummary summary={summary} />
    </div>
  );
}
