import React from "react";
import { noop } from "lodash-es";
import { startCase } from "lodash-es";
import CommonSelectField from "./commonSelectField";

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
    <CommonSelectField
      title={title}
      value={trackId}
      setValue={setTrackId}
      options={options}
      itemHeight={56}
    />
  );
}
