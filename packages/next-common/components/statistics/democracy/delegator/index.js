import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useColumns from "next-common/components/styledList/useColumns";
import { backendApi } from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import Flex from "next-common/components/styled/flex";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import CapitalListItem from "next-common/components/dataList/capitalListItem";

const Wrapper = styled.div``;

function getSortParams(sortedColumn) {
  if (!sortedColumn) {
    return {};
  }

  let colName;
  switch (sortedColumn) {
    case "CAPITAL":
      colName = "balance";
      break;
    case "VOTES":
      colName = "votes";
      break;
    default:
      colName = "account";
  }

  return { sort: JSON.stringify([colName, "desc"]) };
}

export default function Delegator({ delegators, apiRoot = "democracy" }) {
  const [delegatorsList, setDelegatorsList] = useState(delegators);
  const { decimals, voteSymbol, symbol } = useChainSettings();

  const { sortedColumn, columns } = useColumns(
    [
      { name: "ADDRESS", style: { textAlign: "left", minWidth: "230px" } },
      { name: "TARGET", style: { textAlign: "left", minWidth: "230px" } },
      {
        name: "CAPITAL",
        style: { textAlign: "right", width: "168px", minWidth: "168px" },
        sortable: true,
      },
      {
        name: "VOTES",
        style: { textAlign: "right", width: "128px", minWidth: "128px" },
        sortable: true,
      },
    ],
    "VOTES",
  );

  const sortedColumnChanged = useStateChanged(sortedColumn);

  const fetchData = useCallback(
    (page, pageSize) => {
      backendApi
        .fetch(`${apiRoot}/delegators`, {
          ...getSortParams(sortedColumn),
          page,
          pageSize,
        })
        .then(({ result }) => {
          if (result) {
            setDelegatorsList(result);
          }
        });
    },
    [sortedColumn, apiRoot],
  );

  useEffect(() => {
    if (!sortedColumnChanged) {
      return;
    }

    fetchData(delegatorsList?.page, delegatorsList?.pageSize);
  }, [
    sortedColumnChanged,
    fetchData,
    delegatorsList?.page,
    delegatorsList?.pageSize,
  ]);

  const rows = (delegatorsList?.items || []).map((item) => {
    const row = [
      <Flex key="account">
        <AddressUser add={item.account} maxWidth={230} />
      </Flex>,
      <Flex key="delegatee">
        <AddressUser add={item.delegatee} maxWidth={230} />
      </Flex>,
      <CapitalListItem
        key="capital"
        item={item}
        capital={toPrecision(item.balance || 0, decimals)}
        value={item.conviction}
      />,
      <ValueDisplay
        key="votes"
        value={toPrecision(item.votes || 0, decimals)}
        symbol={voteSymbol || symbol}
      />,
    ];

    return row;
  });

  return (
    <Wrapper>
      <div id="header"></div>
      <ScrollerX>
        <DataList columns={columns} rows={rows} />
      </ScrollerX>
      <Pagination
        {...delegatorsList}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, delegatorsList?.pageSize);
          document.getElementById("header").scrollIntoView({ block: "center" });
        }}
      />
    </Wrapper>
  );
}
