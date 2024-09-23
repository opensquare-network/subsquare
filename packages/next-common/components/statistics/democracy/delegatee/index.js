import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useColumns from "next-common/components/styledList/useColumns";
import nextApi from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import Flex from "next-common/components/styled/flex";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import AddressUser from "next-common/components/user/addressUser";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import DataList from "next-common/components/dataList";
import DetailButton from "next-common/components/detailButton";
import dynamicPopup from "next-common/lib/dynamic/popup";

const BeenDelegatedListPopup = dynamicPopup(() =>
  import("../beenDelegatedPopup"),
);

const Wrapper = styled.div``;

function getSortParams(sortedColumn) {
  if (!sortedColumn) {
    return {};
  }

  let colName;
  switch (sortedColumn) {
    case "DELEGATORS":
      colName = "delegatorsCount";
      break;
    case "CAPITAL":
      colName = "delegatedCapital";
      break;
    case "VOTES":
      colName = "delegatedVotes";
      break;
    default:
      colName = "account";
  }

  return { sort: JSON.stringify([colName, "desc"]) };
}

export default function DemocracyDelegatee({
  delegatee,
  apiRoot = "democracy",
}) {
  const [delegateeList, setDelegateeList] = useState(delegatee);
  const [showPopup, setShowPopup] = useState(false);
  const [delegateeData, setDelegateeData] = useState();
  const { decimals, voteSymbol, symbol } = useChainSettings();

  const { sortedColumn, columns } = useColumns(
    [
      { name: "ADDRESS", style: { textAlign: "left", minWidth: "230px" } },
      {
        name: "DELEGATORS",
        style: { textAlign: "right", width: "128px", minWidth: "128px" },
        sortable: true,
      },
      {
        name: "CAPITAL",
        style: { textAlign: "right", width: "128px", minWidth: "128px" },
        sortable: true,
      },
      {
        name: "VOTES",
        style: { textAlign: "right", width: "128px", minWidth: "128px" },
        sortable: true,
      },
      {
        name: "",
        style: { textAlign: "right", width: "80px", minWidth: "80px" },
      },
    ],
    "VOTES",
  );

  const sortedColumnChanged = useStateChanged(sortedColumn);

  const fetchData = useCallback(
    (page, pageSize) => {
      nextApi
        .fetch(`${apiRoot}/delegatee`, {
          ...getSortParams(sortedColumn),
          page,
          pageSize,
        })
        .then(({ result }) => {
          if (result) {
            setDelegateeList(result);
          }
        });
    },
    [sortedColumn, apiRoot],
  );

  useEffect(() => {
    if (!sortedColumnChanged) {
      return;
    }

    fetchData(delegateeList?.page, delegateeList?.pageSize);
  }, [
    sortedColumnChanged,
    fetchData,
    delegateeList?.page,
    delegateeList?.pageSize,
  ]);

  const rows = (delegateeList?.items || []).map((item) => {
    const row = [
      <Flex key="account">
        <AddressUser add={item.account} maxWidth={230} />
      </Flex>,
      item.delegatorsCount,
      <ValueDisplay
        key="delegatedCapital"
        value={toPrecision(item.delegatedCapital || 0, decimals)}
        symbol={voteSymbol || symbol}
      />,
      <ValueDisplay
        key="delegatedVotes"
        value={toPrecision(item.delegatedVotes || 0, decimals)}
        symbol={voteSymbol || symbol}
      />,
      <div key="detail">
        <DetailButton
          onClick={() => {
            setDelegateeData(item);
            setShowPopup(true);
          }}
        />
      </div>,
    ];

    row.onClick = () => {
      setDelegateeData(item);
      setShowPopup(true);
    };

    return row;
  });

  return (
    <Wrapper>
      <div id="header"></div>
      <ScrollerX>
        <DataList columns={columns} rows={rows} />
      </ScrollerX>
      <Pagination
        {...delegateeList}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, delegateeList?.pageSize);
          document.getElementById("header").scrollIntoView({ block: "center" });
        }}
      />
      {showPopup && (
        <BeenDelegatedListPopup
          apiRoot={apiRoot}
          setShow={setShowPopup}
          delegatee={delegateeData?.account}
          delegatedCapital={delegateeData?.delegatedCapital}
          delegatedVotes={delegateeData?.delegatedVotes}
          delegatorsCount={delegateeData?.delegatorsCount}
        />
      )}
    </Wrapper>
  );
}
