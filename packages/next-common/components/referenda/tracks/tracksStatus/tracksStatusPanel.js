import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TrackStatusItem from "./trackStatusItem";
import Loading from "next-common/components/loading";
import { BucketProvider } from "./useBucket";

export default function TracksStatusPanel({ tracks, isLoading }) {
  if (isLoading) {
    return (
      <SecondaryCard>
        <div className="flex justify-center">
          <Loading size={16} />
        </div>
      </SecondaryCard>
    );
  }

  return (
    <SecondaryCard>
      <BucketProvider>
        <div className="m-[-24px]">
          {(tracks || []).map((track) => (
            <TrackStatusItem
              key={track.trackId}
              trackId={track.trackId}
              {...track.referenda}
            />
          ))}
        </div>
      </BucketProvider>
    </SecondaryCard>
  );
}
