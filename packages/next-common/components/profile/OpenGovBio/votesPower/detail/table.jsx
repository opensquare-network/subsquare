import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useOpenGovVotesPowerContext } from "../../context/votesPower";
import { MapDataList } from "next-common/components/dataList";
import Track from "next-common/components/referenda/track/trackTag";
import { useMaybeServerAllBeenDelegatedList } from "next-common/utils/hooks/referenda/useAllBeenDelegatedList";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { useState } from "react";
import DetailButton from "next-common/components/detailButton";

const BeenDelegatedPopup = dynamicPopup(() =>
  import(
    "next-common/components/profile/delegation/beenDelegated/beenDelegatedPopup"
  ),
);

function VotesValue({ value }) {
  const { symbol, decimals } = useChainSettings();

  return (
    <ValueDisplay
      key={"votes"}
      symbol={symbol}
      value={toPrecision(value, decimals)}
    />
  );
}

const TrackColumn = {
  name: "Track",
  render(data) {
    return <Track key={"track"} id={data?.track?.id} />;
  },
};

const DelegatorsColumn = {
  name: "Delegators",
  className: "text-right w-40",
  render(data) {
    return <div>{data?.beenDelegated?.length}</div>;
  },
};

const VotesColumn = {
  name: "Votes",
  className: "text-right w-40",
  render(data) {
    return <VotesValue value={data?.totalVotes} />;
  },
};

export default function OpenGovVotesPowerDetailList() {
  const { address } = useOpenGovVotesPowerContext();
  const { isLoading, beenDelegatedList: dataList } =
    useMaybeServerAllBeenDelegatedList(address);
  const [showTrackPopup, setShowTrackPopup] = useState(false);
  const [popupTrack, setPopupTrack] = useState(null);

  const TrackDetailColumn = {
    name: "",
    className: "text-right w-20",
    render(data) {
      return (
        <DetailButton
          onClick={() => {
            setPopupTrack(data?.track?.id);
            setShowTrackPopup(true);
          }}
        />
      );
    },
  };

  const columnsDef = [
    TrackColumn,
    DelegatorsColumn,
    VotesColumn,
    TrackDetailColumn,
  ];

  return (
    <>
      <TitleContainer className="text14Bold px-0">Received</TitleContainer>
      <div className="max-h-[400px] overflow-y-scroll scrollbar-pretty">
        <MapDataList
          loading={isLoading}
          columnsDef={columnsDef}
          data={dataList}
          noDataText="No been delegated"
        />
      </div>
      {showTrackPopup && (
        <BeenDelegatedPopup
          track={popupTrack}
          beenDelegatedList={dataList}
          setShow={setShowTrackPopup}
        />
      )}
    </>
  );
}
