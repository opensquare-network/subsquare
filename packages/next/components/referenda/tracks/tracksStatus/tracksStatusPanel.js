import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import TrackStatusItem from "./trackStatusItem";
import useGroupedReferenda from "./useGroupedReferenda";
import Loading from "next-common/components/loading";
import { BucketContext } from "./useBucket";

export default function TracksStatusPanel() {
  const { tracks, isLoading } = useGroupedReferenda();

  return (
    <SecondaryCard>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading size={16} />
        </div>
      ) : (
        <BucketContext>
          <div className="m-[-24px]">
            {(tracks || []).map((track) => (
              <TrackStatusItem
                key={track.trackId}
                trackId={track.trackId}
                {...track.referenda}
              />
            ))}
          </div>
        </BucketContext>
      )}
    </SecondaryCard>
  );
}