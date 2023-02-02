import React from "react";
import noop from "lodash.noop";
import TrackSelect from "../../trackSelect";
import PopupLabel from "../label";

export default function Track({ track, setTrack = noop }) {
  return (
    <div>
      <PopupLabel text="Track" />
      <TrackSelect selectedTrack={track} setSelectedTrack={setTrack} />
    </div>
  );
}
