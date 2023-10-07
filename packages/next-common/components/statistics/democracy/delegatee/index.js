import React from "react";
import styled from "styled-components";
import StyledListOrigin from "next-common/components/styledList";
import { useCallback, useEffect, useState } from "react";
import useColumns from "next-common/components/styledList/useColumns";
import nextApi from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import EnterSVG from "next-common/assets/imgs/icons/enter.svg";
import Flex from "next-common/components/styled/flex";
import BeenDelegatedListPopup from "../beenDelegatedPopup";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { pretty_scroll_bar } from "next-common/styles/componentCss";
import AddressUser from "next-common/components/user/addressUser";

const Wrapper = styled.div``;

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
  ${pretty_scroll_bar};
`;

const StyledList = styled(StyledListOrigin)`
  border: none;
  box-shadow: none;
  padding: 0;
`;

function getSortParams(sortedColumn) {
  if (!sortedColumn) {
    return {};
  }

  let colName;
  switch (sortedColumn) {
    case "COUNT":
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
        name: "COUNT",
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
        style: { textAlign: "right", width: "40px", minWidth: "40px" },
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

  const rows = (delegateeList.items || []).map((item) => {
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
      <Flex key="enter" style={{ padding: "0 0 0 24px" }}>
        <EnterSVG />
      </Flex>,
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
      <ListWrapper>
        <StyledList columns={columns} rows={rows} />
      </ListWrapper>
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
