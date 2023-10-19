import PopupListWrapper from "../../styled/popupListWrapper";
import React from "react";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "../../../context/chain";
import StyledList from "next-common/components/styledList";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";
import AddressUser from "next-common/components/user/addressUser";
import { useSelector } from "react-redux";
import { myReferendaDelegationsSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import Track from "next-common/components/referenda/track/trackTag";
import RemoveDelegation from "next-common/components/summary/democracyAllMyDelegationPopup/remove";

export default function AllMyDelegationPopupList() {
  const { decimals } = useChainSettings();
  const delegations = useSelector(myReferendaDelegationsSelector);

  const colWidths = {
    track: 160,
    delegatingTo: 144,
    capital: 160,
    action: 80,
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
    {
      name: "Action",
      style: {
        textAlign: "right",
        width: colWidths.action,
        minWidth: colWidths.action,
      },
    },
  ];

  const rows = delegations.map((item) => {
    const row = [
      <Track key="track" id={item.trackId} />,
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
      <RemoveDelegation key="action" trackId={item.trackId} />,
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
