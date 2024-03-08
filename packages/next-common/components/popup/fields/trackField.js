import React from "react";
import { noop } from "lodash-es";
import { usePageProps } from "../../../context/page";
import startCase from "lodash.startcase";
import Select from "../../select";
import PopupLabel from "../label";

export default function Track({
  title = "Track",
  track,
  setTrack = noop,
  hasAll = false,
  trackList,
}) {
  const { tracks: defaultTrackList } = usePageProps();
  const options = (trackList || defaultTrackList)?.map((track) => {
    return {
      label: startCase(track.name),
      value: track.id,
    };
  });

  if (hasAll) {
    options?.unshift?.({ label: "All", value: "all" });
  }

  return (
    <div>
      {title && <PopupLabel text={title} />}
      <Select
        value={track}
        options={options}
        onChange={(item) => setTrack(item.value)}
        maxDisplayItem={7}
      />
    </div>
  );
}
