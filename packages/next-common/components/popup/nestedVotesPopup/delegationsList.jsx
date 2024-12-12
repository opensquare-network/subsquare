"use client";

import { useMemo, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import ValueDisplay from "next-common/components/valueDisplay";
import Pagination from "next-common/components/pagination";
import CapitalListItem from "next-common/components/dataList/capitalListItem";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import { toPrecision } from "next-common/utils";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";

export default function DelegationsList({ delegations }) {
  const [detailListPage, setDetailListPage] = useState(1);

  const pageSize = 30;
  function onPageChange(e, newPage) {
    e.preventDefault();
    setDetailListPage(newPage);
  }
  const pagination = {
    page: detailListPage,
    pageSize,
    total: delegations?.length || 0,
    onPageChange,
  };
  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  const items = useMemo(() => {
    return delegations.slice(sliceFrom, sliceTo);
  }, [delegations, sliceFrom, sliceTo]);

  if (!delegations || delegations.length === 0) {
    return null;
  }

  return (
    <>
      <div className="m-0 mb-2 text14Bold text-textPrimary">
        Delegation List
      </div>
      <DetailDelegatorList items={items} />
      <Pagination {...pagination} />
    </>
  );
}

function DetailDelegatorList({ items = [] }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;

  const columns = [
    {
      name: "DELEGATOR",
      style: { minWidth: 296, textAlign: "left" },
    },
    {
      name: "CAPITAL",
      style: { minWidth: 168, textAlign: "right" },
    },
    {
      name: "VOTES",
      style: { minWidth: 128, textAlign: "right" },
    },
  ];

  const rows = items?.map((item) => {
    const capital = item.balance;

    const row = [
      <AddressUser
        key="user"
        add={item.account}
        noTooltip
        maxWidth={296}
        link="/votes"
      />,
      <CapitalListItem
        key="capital"
        item={item}
        capital={toPrecision(capital, chainSettings.decimals)}
      />,
      <ValueDisplay
        key="value"
        value={toPrecision(item.votes, chainSettings.decimals)}
        symbol={symbol}
      />,
    ];

    return row;
  });

  return (
    <PopupListWrapper className="max-sm:[&_table_tbody]:!max-h-[180px]">
      <DataList scrollToFirstRowOnChange columns={columns} rows={rows} />
    </PopupListWrapper>
  );
}
