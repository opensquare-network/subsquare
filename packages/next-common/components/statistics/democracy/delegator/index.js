import React from "react";
import User from "next-common/components/user";
import styled from "styled-components";
import StyledList from "next-common/components/styledList";
import { useCallback, useEffect, useState } from "react";
import useColumns from "next-common/components/styledList/useColumns";
import nextApi from "next-common/services/nextApi";
import Pagination from "next-common/components/pagination";
import useStateChanged from "next-common/hooks/useStateChanged";
import Flex from "next-common/components/styled/flex";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { convictionToLockX } from "next-common/utils/referendumCommon";

const Wrapper = styled.div`
`;

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
`;

const ConvictionText = styled.span`
  width: 40px;
  color: ${p => p.theme.textTertiary};
`;

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

export default function Delegator({ delegators }) {
  const [delegatorsList, setDelegatorsList] = useState(delegators);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      nextApi
        .fetch("statistics/democracy/delegators", {
          ...getSortParams(sortedColumn),
          page,
          pageSize,
        })
        .then(({ result }) => {
          if (result) {
            setDelegatorsList(result);
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

    fetchData(delegatorsList?.page, delegatorsList?.pageSize);
  }, [
    sortedColumnChanged,
    fetchData,
    delegatorsList?.page,
    delegatorsList?.pageSize,
  ]);

  const rows = (delegatorsList?.items || []).map((item) => {
    const row = [
      <Flex key="account" style={{ maxWidth: "230px", overflow: "hidden" }}>
        <User add={item.account} fontSize={14} />
      </Flex>,
      <Flex key="delegatee" style={{ maxWidth: "230px", overflow: "hidden" }}>
        <User add={item.delegatee} fontSize={14} />
      </Flex>,
      <Flex key="capital" style={{ justifyContent: "right" }}>
        <ValueDisplay
          value={toPrecision(item.balance || 0, decimals)}
          symbol={voteSymbol || symbol}
        />
        <ConvictionText>{convictionToLockX(item.conviction)}</ConvictionText>
      </Flex>,
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
      <ListWrapper>
        <StyledList columns={columns} rows={rows} loading={isLoading} />
      </ListWrapper>
      <Pagination
        {...delegatorsList}
        onPageChange={(e, page) => {
          e.stopPropagation();
          e.preventDefault();
          fetchData(page, delegatorsList?.pageSize);
          window.scrollTo(0, 0);
        }}
      />
    </Wrapper>
  );
}