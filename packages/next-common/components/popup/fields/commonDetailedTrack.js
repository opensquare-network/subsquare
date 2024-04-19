import React from "react";
import { noop } from "lodash-es";
import { startCase } from "lodash-es";
import Select from "../../select";
import PopupLabel from "../label";

export default function CommonDetailedTrack({
  title = "Track",
  trackId,
  setTrackId = noop,
  trackList = [],
}) {
  const options = trackList?.map((track) => {
    return {
      label: (
        <div className="overflow-hidden">
          <div className="text14Medium text-textPrimary">
            {`[${track.id}] ${startCase(track.name)}`}
          </div>
          <div className="text12Medium text-textTertiary truncate">
            {track.description}
          </div>
        </div>
      ),
      text: startCase(track.name),
      value: track.id,
    };
  });

  return (
    <div>
      {title && <PopupLabel text={title} />}
      <Select
        value={trackId}
        options={options}
        onChange={(item) => setTrackId(item.value)}
        maxDisplayItem={7}
        itemHeight={56}
      />
    </div>
  );
}
