import React from "react";
import { noop } from "lodash-es";
import { startCase } from "lodash-es";
import CommonSelectField from "./commonSelectField";
import { useChain } from "next-common/context/chain";
import { isZkverifyChain } from "next-common/utils/chain";

export default function CommonDetailedTrack({
  title = "Track",
  trackId,
  setTrackId = noop,
  trackList = [],
}) {
  const chain = useChain();
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
      readOnly={isZkverifyChain(chain)}
    />
  );
}
