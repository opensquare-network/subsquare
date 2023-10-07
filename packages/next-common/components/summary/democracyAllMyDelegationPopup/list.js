import PopupListWrapper from "../../styled/popupListWrapper";
import React from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";
import { Conviction } from "../../../utils/referendumCommon";
import StyledList from "next-common/components/styledList";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import Gov2TrackTag from "next-common/components/gov2/trackTag";
import AddressUser from "next-common/components/user/addressUser";

export default function AllMyDelegationPopupList({ myDelegationList = [] }) {
  const { decimals } = useChainSettings();

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

  const rows = myDelegationList.map((item) => {
    const row = [
      <Gov2TrackTag key="track" name={item.track.name} />,
      <AddressUser
        key="user"
        add={item.delegation.target}
        maxWidth={colWidths.delegatingTo}
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(item.delegation.balance, decimals)}
        conviction={Conviction[item.delegation.conviction]}
      />,
    ];

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
