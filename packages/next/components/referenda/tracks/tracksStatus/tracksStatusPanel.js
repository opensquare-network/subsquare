import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TrackStatusItem from "./trackStatusItem";
import useGroupedReferenda from "./useGroupedReferenda";

export default function TracksStatusPanel() {
  const tracks = useGroupedReferenda();

  return (
    <SecondaryCard>
      <div className="m-[-24px]">
        {tracks.map((track) => (
          <TrackStatusItem
            key={track.trackId}
            trackId={track.trackId}
            {...track.referenda}
          />
        ))}
      </div>
    </SecondaryCard>
  );
}
