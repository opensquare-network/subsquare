import TracksStatusPanel from "./tracksStatusPanel";
import { useState } from "react";
import Toggle from "next-common/components/toggle";
import useTrackStatusData from "./useTrackStatusData";
import SortBySelect, {
  SortByMostOngoingReferenda,
  SortByTrackIndex,
} from "./sortBySelect";
import { cn } from "next-common/utils";

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
  const [sortBy, setSortBy] = useState(SortByTrackIndex);
  const { tracks, isLoading } = useTrackStatusData(
    hideIdleTracks,
    sortBy === SortByMostOngoingReferenda,
  );

  return (
    <div className="flex flex-col">
      <div className="flex max-sm:flex-col sm:items-center justify-between mx-[24px] mb-[16px] gap-[12px]">
        <Title tracksCount={tracks?.length} />
        <div
          className={cn("flex gap-[24px]", "max-sm:flex-col max-sm:gap-[12px]")}
        >
          <HideIdleTracksSwitch
            isOn={hideIdleTracks}
            setIsOn={setHideIdleTracks}
          />
          <SortBySelect sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <TracksStatusPanel tracks={tracks} isLoading={isLoading} />
    </div>
  );
}
