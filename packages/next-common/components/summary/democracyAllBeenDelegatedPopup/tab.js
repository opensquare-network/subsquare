import { uniq } from "lodash-es";
import React, { useMemo, useState } from "react";
import { usePageProps } from "../../../context/page";
import Track from "../../popup/fields/trackField";
import VStack from "../../styled/vStack";
import AllBeenDelegatedPopupAllList from "./allList";
import AllBeenDelegatedPopupTrackList from "./trackList";

export default function AllBeenDelegatedPopupTabList({ beenDelegatedList }) {
  const [track, setTrack] = useState("all");
  const { tracks } = usePageProps();

  const trackBeenDelegatedList = useMemo(() => {
    const beenDelegated = beenDelegatedList?.find((item) => {
      return item.track?.id === track;
    });
    return beenDelegated?.beenDelegated;
  }, [track, beenDelegatedList]);

  const trackList = useMemo(() => {
    const uniqTrackIds = uniq(
      (beenDelegatedList || []).map((item) => item.track?.id),
    );
    return (tracks || []).filter((track) => uniqTrackIds.includes(track.id));
  }, [tracks, beenDelegatedList]);

  return (
    <VStack space={16}>
      <Track
        title=""
        hasAll
        track={track}
        setTrack={setTrack}
        trackList={trackList}
      />

      {track === "all" ? (
        <AllBeenDelegatedPopupAllList
          beenDelegatedList={beenDelegatedList}
          onTrackClick={setTrack}
        />
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
