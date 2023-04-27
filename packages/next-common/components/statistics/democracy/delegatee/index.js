import React from "react";
import Divider from "next-common/components/styled/layout/divider";
import User from "next-common/components/user";
import styled from "styled-components";
import StyledList from "next-common/components/styledList";
import { useCallback, useEffect, useState } from "react";
import useColumns from "next-common/components/styledList/useColumns";
import nextApi from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import EnterSVG from "./enter.svg";
import Flex from "next-common/components/styled/flex";
import BeenDelegatedListPopup from "../beenDelegatedPopup";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 48px;
  gap: 16px;

  background: #ffffff;
  border: 1px solid #ebeef4;
  box-shadow: 0px 6px 7px rgba(30, 33, 52, 0.02),
    0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),
    0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786);
  border-radius: 8px;

  margin-top: 16px;

  gap: 16px;
`;

const Header = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  color: #1e2134;
`;

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
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

export default function DemocracyDelegatee({ delegatee }) {
  const [delegateeList, setDelegateeList] = useState(delegatee);
  const [showPopup, setShowPopup] = useState(false);
  const [delegateeData, setDelegateeData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { decimals, voteSymbol, symbol } = useChainSettings();

  const { sortedColumn, columns } = useColumns(
    [
      { name: "ADDRESS", style: { textAlign: "left", minWidth: "260px" } },
      {
        name: "COUNT",
        style: { textAlign: "right", width: "100px", minWidth: "100px" },
        sortable: true,
      },
      {
        name: "CAPITAL",
        style: { textAlign: "right", width: "100px", minWidth: "100px" },
        sortable: true,
      },
      {
        name: "VOTES",
        style: { textAlign: "right", width: "100px", minWidth: "100px" },
        sortable: true,
      },
      { name: "", style: { textAlign: "right", width: "40px", minWidth: "40px" } },
    ],
    "VOTES",
  );

  const sortedColumnChanged = useStateChanged(sortedColumn);

  const fetchData = useCallback(
    (page, pageSize) => {
      setIsLoading(true);
      nextApi
        .fetch("statistics/democracy/delegatee", {
          ...getSortParams(sortedColumn),
          page,
          pageSize,
        })
        .then(({ result }) => {
          if (result) {
            setDelegateeList(result);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [sortedColumn],
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
      <Flex key="account" style={{ maxWidth: "260px", overflow: "hidden" }}>
        <User add={item.account} fontSize={14} />
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
      <Header>Delegation</Header>
      <Divider />
      <Header>Delegatee</Header>
      <ListWrapper>
        <StyledList columns={columns} rows={rows} loading={isLoading} />
      </ListWrapper>
      <Pagination
        {...delegateeList}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, delegateeList?.pageSize);
          window.scrollTo(0, 0);
        }}
      />
      {showPopup && (
        <BeenDelegatedListPopup
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
