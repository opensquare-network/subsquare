import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

import { useChainSettings } from "next-common/context/chain";
import PopupListWrapper from "../../../styled/popupListWrapper";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";

function DelegationList({ items, loading = false }) {
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
      <AddressUser
        key="user"
        add={item.delegator}
        maxWidth={colWidths.address}
        link="/votes"
      />,
      <CapitalListItem
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
      <DataList columns={columns} rows={rows} loading={loading} />
    </PopupListWrapper>
  );
}

export default DelegationList;
