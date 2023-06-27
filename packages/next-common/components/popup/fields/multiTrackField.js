import React, { useMemo } from "react";
import { usePageProps } from "../../../context/page";
import startCase from "lodash.startcase";
import PopupLabel from "../label";
import MultiSelect from "next-common/components/multiSelect";
import useCall from "next-common/utils/hooks/useCall";
import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Loading from "next-common/components/loading";

export default function MultiTrack({
  title = "Track",
  trackList,
  selectedTracks,
  setSelectedTracks,
}) {
  const { tracks: defaultTrackList } = usePageProps();
  const tracks = trackList || defaultTrackList;

  const address = useRealAddress();
  const api = useApi();
  let [myVotingTuple, isLoading] = useCall(
    api?.query?.convictionVoting?.votingFor.entries,
    [address],
  );

  const myVotes = useMemo(() => {
    if (isLoading || !myVotingTuple) {
      return {};
    }

    return (myVotingTuple || []).reduce((result, [storageKey, voting]) => {
      const trackId = storageKey.args[1].toNumber();
      if (voting.isDelegating) {
        result[trackId] = { disabled: true, info: "Delegated" };
      } else if (voting.isCasting && voting.asCasting.votes.length > 0) {
        console.log("voting", voting);
        result[trackId] = { disabled: true, info: "Voted" };
      }

      return result;
    }, {});
  }, [myVotingTuple, isLoading]);

  const options = useMemo(() => {
    return tracks.map((track) => {
      const { id, name } = track;
      const { disabled, info } = myVotes[id] || {};
      const label = startCase(name);
      const value = id;
      return {
        label,
        value,
        disabled,
        info,
      };
    });
  }, [tracks, myVotes]);

  const status = isLoading && <Loading />;

  return (
    <div>
      {title && <PopupLabel text={title} status={status} />}
      <MultiSelect
        disabled={isLoading}
        itemName="track"
        options={options}
        selectedValues={selectedTracks}
        setSelectedValues={setSelectedTracks}
        maxDisplayItem={7}
      />
    </div>
  );
}
