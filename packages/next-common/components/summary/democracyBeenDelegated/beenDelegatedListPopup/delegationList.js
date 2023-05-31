import React from "react";
import { toPrecision } from "next-common/utils";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";

import { useChainSettings } from "next-common/context/chain";
import PopupListWrapper from "../../../styled/popupListWrapper";
import StyledList from "next-common/components/styledList";
import CapitalTableItem from "next-common/components/popup/capitalTableItem";

function DelegationList({ items, loading = true }) {
  const node = useChainSettings();
  const symbol = node.voteSymbol || node.symbol;

  const colWidths = {
    address: 266,
    capital: 168,
    votes: 128,
  };

  const columns = [
    {
      name: "ADDRESS",
      style: {
        textAlign: "left",
        width: colWidths.address,
        minWidth: colWidths.address,
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
      name: "VOTES",
      style: {
        textAlign: "right",
        width: colWidths.votes,
        minWidth: colWidths.votes,
      },
    },
  ];

  const rows = items?.map?.((item) => {
    const row = [
      <User
        key="user"
        add={item.delegator}
        fontSize={14}
        maxWidth={colWidths.address}
      />,
      <CapitalTableItem
        key="capital"
        item={item}
        capital={toPrecision(item.balance, node.decimals)}
        conviction={item.conviction}
      />,
      <ValueDisplay
        key="votes"
        value={toPrecision(item.votes, node.decimals)}
        symbol={symbol}
      />,
    ];
    return row;
  });

  return (
    <PopupListWrapper>
      <StyledList columns={columns} rows={rows} loading={loading} />
    </PopupListWrapper>
  );
}

export default DelegationList;
