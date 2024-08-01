import TracksStatusPanel from "./tracksStatusPanel";
import useGroupedReferenda from "./useGroupedReferenda";
import { useReferendaTracks } from "next-common/context/referenda/tracks";
import { useMemo, useState } from "react";
import Toggle from "next-common/components/toggle";

function useTrackStatusData(hideIdleTracks) {
  const { tracks: tracksWithReferenda, isLoading: isLoadingGroupedReferenda } =
    useGroupedReferenda();
  const { tracks: allTracks, isLoading: isLoadingTracks } =
    useReferendaTracks();
  const isLoading = isLoadingGroupedReferenda || isLoadingTracks;

  const tracks = useMemo(() => {
    if (isLoading) {
      return [];
    }

    if (hideIdleTracks) {
      return tracksWithReferenda;
    }

    return allTracks.map(({ id }) => {
      const trackWithReferenda = tracksWithReferenda.find(
        ({ trackId }) => trackId === id,
      );
      if (trackWithReferenda) {
        return trackWithReferenda;
      }
      return {
        trackId: id,
        referenda: {
          preparing: [],
          queueing: [],
          deciding: [],
          confirming: [],
        },
      };
    });
  }, [tracksWithReferenda, allTracks, isLoading, hideIdleTracks]);

  return {
    tracks,
    isLoading: false,
  };
}

function Title({ tracksCount }) {
  return (
    <span className="text16Bold text-textPrimary">
      Tracks{" "}
      <span className="text16Medium text-textTertiary">{tracksCount}</span>
    </span>
  );
}

function HideIdleTracksSwitch({ isOn, setIsOn }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text12Medium text-textSecondary">Hide idle tracks</span>
      <Toggle isOn={isOn} onToggle={setIsOn} size="small" />
    </div>
  );
}

export default function TracksStatus() {
  const [hideIdleTracks, setHideIdleTracks] = useState(false);
  const { tracks, isLoading } = useTrackStatusData(hideIdleTracks);

  return (
    <div className="flex flex-col">
      <div className="flex max-sm:flex-col sm:items-center justify-between mx-[24px] mb-[16px] gap-[12px]">
        <Title tracksCount={tracks?.length} />
        <div className="flex gap-[24px]">
          <HideIdleTracksSwitch
            isOn={hideIdleTracks}
            setIsOn={setHideIdleTracks}
          />
        </div>
      </div>
      <TracksStatusPanel tracks={tracks} isLoading={isLoading} />
    </div>
  );
}
