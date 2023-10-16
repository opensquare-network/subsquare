import PopupListWrapper from "../../styled/popupListWrapper";
import React from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";
import StyledList from "next-common/components/styledList";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import AddressUser from "next-common/components/user/addressUser";
import { useSelector } from "react-redux";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import { usePageProps } from "next-common/context/page";

export default function AllMyDelegationPopupList() {
  const { decimals } = useChainSettings();
  const delegations = useSelector(myReferendaDelegationsSelector);
  const { tracks } = usePageProps();

  const colWidths = {
    track: 154,
    delegatingTo: 240,
    capital: 168,
  };

  const columns = [
    {
      name: "TRACK",
      style: {
        textAlign: "left",
        width: colWidths.track,
        minWidth: colWidths.track,
      },
    },
    {
      name: "DELEGATING TO",
      style: {
        textAlign: "left",
        width: colWidths.delegatingTo,
        minWidth: colWidths.delegatingTo,
      },
    },
    {
      name: "CAPITAL",
      style: {
        textAlign: "right",
        width: colWidths.capital,
        minWidth: colWidths.capital,
      },
    },
  ];

  const rows = delegations.map((item) => {
    const track = tracks.find((track) => track.id === item.trackId);
    const row = [
      <Gov2TrackTag key="track" name={track.name || item.trackId} />,
      <AddressUser
        key="user"
        add={item.target}
        maxWidth={colWidths.delegatingTo}
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(item.balance, decimals)}
        conviction={item.conviction}
      />,
    ];

    row.key = item.trackId;
    return row;
  });

  return (
    <PopupListWrapper>
      <StyledList
        columns={columns}
        rows={rows}
        noDataText="No current delegations"
      />
    </PopupListWrapper>
  );
}
