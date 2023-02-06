import React, { useMemo, useState } from "react";
import Track from "../../popup/fields/trackField";
import VStack from "../../styled/vStack";
import AllBeenDelegatedPopupAllList from "./allList";
import AllBeenDelegatedPopupTrackList from "./trackList";

export default function AllBeenDelegatedPopupTabList({ beenDelegatedList }) {
  const [track, setTrack] = useState("all");

  const trackBeenDelegatedList = useMemo(() => {
    const beenDelegated = beenDelegatedList?.find((item) => {
      return item.track?.id === track;
    });
    return beenDelegated?.beenDelegated;
  }, [track, beenDelegatedList]);

  return (
    <VStack space={16}>
      <Track title="" hasAll track={track} setTrack={setTrack} />

      {track === "all" ? (
        <AllBeenDelegatedPopupAllList beenDelegatedList={beenDelegatedList} />
      ) : (
        <AllBeenDelegatedPopupTrackList
          track={track}
          beenDelegatedList={beenDelegatedList}
          trackBeenDelegatedList={trackBeenDelegatedList}
        />
      )}
    </VStack>
  );
}
