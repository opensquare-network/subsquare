import React from "react";
import noop from "lodash.noop";
import { usePageProps } from "../../../context/page";
import startCase from "lodash.startcase";
import Select from "../../select";
import PopupLabel from "../label";

export default function DetailedTrack({
  title = "Track",
  track,
  setTrack = noop,
}) {
  const { tracks: trackList } = usePageProps();
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
        value={track}
        options={options}
        onChange={(item) => setTrack(item.value)}
        maxDisplayItem={7}
        itemHeight={56}
      />
    </div>
  );
}
