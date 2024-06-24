import { useState } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useChainSettings } from "next-common/context/chain";
import Track from "next-common/components/referenda/track/trackTag";
import ValueDisplay from "next-common/components/valueDisplay";
import DataList from "next-common/components/dataList";
import { toPrecision } from "next-common/utils";
import DetailButton from "next-common/components/detailButton";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BeenDelegatedPopup = dynamicPopup(() => import("./beenDelegatedPopup"));

function BeenDelegatedList({ list, isLoading }) {
  const { decimals, symbol } = useChainSettings();
  const [popupTrack, setPopupTrack] = useState(null);
  const [showTrackPopup, setShowTrackPopup] = useState(false);

  const colWidths = {
    track: 160,
    delegators: 240,
    capital: 160,
    votes: 160,
    detail: 80,
  };

  const columns = [
    {
      name: "Track",
      style: {
        textAlign: "left",
        minWidth: colWidths.tracks,
      },
    },
    {
      name: "Delegators",
      style: {
        textAlign: "right",
        width: colWidths.delegators,
        minWidth: colWidths.delegators,
      },
    },
    {
      name: "Capital",
      style: {
        textAlign: "right",
        width: colWidths.capital,
        minWidth: colWidths.capital,
      },
    },
    {
      name: "Votes",
      style: {
        textAlign: "right",
        width: colWidths.votes,
        minWidth: colWidths.votes,
      },
    },
    {
      name: "",
      style: {
        textAlign: "right",
        width: colWidths.detail,
        minWidth: colWidths.detail,
      },
    },
  ];

  const rows = (list || []).map((item) => [
    <Track key="track" id={item.track.id} />,
    <span key="delegators">{item.beenDelegated?.length}</span>,
    <ValueDisplay
      key="capital"
      value={toPrecision(item?.totalBalance, decimals)}
      symbol={symbol}
    />,
    <ValueDisplay
      key="votes"
      value={toPrecision(item?.totalVotes, decimals)}
      symbol={symbol}
    />,
    <div key="detail">
      <DetailButton
        onClick={() => {
          setPopupTrack(item.track.id);
          setShowTrackPopup(true);
        }}
      />
    </div>,
  ]);

  return (
    <>
      <DataList
        loading={isLoading}
        columns={columns}
        rows={rows}
        noDataText="No current delegations"
      />
      {showTrackPopup && (
        <BeenDelegatedPopup
          track={popupTrack}
          beenDelegatedList={list}
          setShow={setShowTrackPopup}
        />
      )}
    </>
  );
}

export default function ReferendaBeenDelegated({
  beenDelegatedList,
  isLoading,
}) {
  return (
    <>
      <div className="flex mx-[24px] text16Bold gap-[4px]">
        <span className="text-textPrimary">Tracks</span>
        <span className="text-textTertiary">{beenDelegatedList?.length}</span>
      </div>
      <SecondaryCard>
        <BeenDelegatedList list={beenDelegatedList} isLoading={isLoading} />
      </SecondaryCard>
    </>
  );
}
