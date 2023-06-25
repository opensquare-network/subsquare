import React from "react";
import { usePageProps } from "../../../context/page";
import startCase from "lodash.startcase";
import PopupLabel from "../label";
import MultiSelect from "next-common/components/multiSelect";

export default function MultiTrack({
  title = "Track",
  trackList,
  selectedTracks,
  setSelectedTracks,
}) {
  const { tracks: defaultTrackList } = usePageProps();
  const options = (trackList || defaultTrackList)?.map((track) => {
    return {
      label: startCase(track.name),
      value: track.id,
    };
  });

  return (
    <div>
      {title && <PopupLabel text={title} />}
      <MultiSelect
        labelAll={"All Tracks"}
        options={options}
        selectedValues={selectedTracks}
        setSelectedValues={setSelectedTracks}
        maxDisplayItem={5}
      />
    </div>
  );
}
