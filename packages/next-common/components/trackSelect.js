import React from "react";
import noop from "lodash.noop";
import { usePageProps } from "../context/page";
import { parseGov2TrackName } from "../utils/gov2";
import Select from "./select";

export default function TrackSelect({
  selectedTrack,
  setSelectedTrack = noop,
}) {
  const { tracks } = usePageProps();
  const options = tracks?.map((track) => {
    return {
      label: parseGov2TrackName(track.name),
      value: track.id,
    };
  });

  return (
    <Select
      value={selectedTrack}
      options={options}
      onChange={(item) => setSelectedTrack(item.value)}
      maxDisplayItem={7}
    />
  );
}
