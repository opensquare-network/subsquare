import React from "react";
import noop from "lodash.noop";
import { usePageProps } from "../../../context/page";
import { parseGov2TrackName } from "../../../utils/gov2";
import Select from "../../select";
import PopupLabel from "../label";

export default function Track({ track, setTrack = noop }) {
  const { tracks } = usePageProps();
  const options = tracks?.map((track) => {
    return {
      label: parseGov2TrackName(track.name),
      value: track.id,
    };
  });

  return (
    <div>
      <PopupLabel text="Track" />
      <Select
        value={track}
        options={options}
        onChange={(item) => setTrack(item.value)}
        maxDisplayItem={7}
      />
    </div>
  );
}
