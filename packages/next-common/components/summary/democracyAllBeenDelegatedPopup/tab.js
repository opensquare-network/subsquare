import { useMemo, useState } from "react";
import Track from "../../popup/fields/trackField";
import VStack from "../../styled/vStack";
import AllBeenDelegatedPopupAllList from "./allList";
import AllBeenDelegatedPopupTrackList from "./trackList";

export default function AllBeenDelegatedPopupTabList({ beenDelegatedList }) {
  const [track, setTrack] = useState("all");

  const trackBeenDelegated = useMemo(() => {
    const beenDelegated = beenDelegatedList?.find((item) => {
      return item.track.id === track;
    });
    return beenDelegated?.beenDelegated;
  }, [track, beenDelegatedList]);

  return (
    <VStack space={16}>
      <Track title="" hasAll track={track} setTrack={setTrack} />

      {track === "all" ? (
        <AllBeenDelegatedPopupAllList items={beenDelegatedList} />
      ) : (
        <AllBeenDelegatedPopupTrackList items={trackBeenDelegated} />
      )}
    </VStack>
  );
}
