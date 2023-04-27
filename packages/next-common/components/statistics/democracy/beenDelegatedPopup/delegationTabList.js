import React, { useEffect, useState } from "react";
import Pagination from "next-common/components/pagination";
import VStack from "next-common/components/styled/vStack";
import styled from "styled-components";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import StyledList from "next-common/components/styledList";
import useColumns from "next-common/components/styledList/useColumns";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { convictionToLockX } from "next-common/utils/referendumCommon";

const ListWrapper = styled.div`
  display: flex;
  max-height: 400px;
  overflow-x: auto;
  overflow-y: auto;
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

export default function DelegationTabList({ delegatee }) {
  const [beenDelegatedList, setBeenDelegatedList] = useState(EmptyList);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const { decimals, voteSymbol, symbol } = useChainSettings();

  function onPageChange(e, target) {
    e.preventDefault();
    setPage(target);
  }

  const pagination = {
    page: beenDelegatedList?.page || 1,
    pageSize: beenDelegatedList?.pageSize || pageSize,
    total: beenDelegatedList?.total || 0,
    onPageChange,
  };

  const { sortedColumn, columns } = useColumns(
    [
      { name: "ADDRESS", style: { textAlign: "left", minWidth: "124px" } },
      {
        name: "CAPITAL",
        style: { textAlign: "right", width: "158px", minWidth: "158px" },
        sortable: true,
      },
      {
        name: "VOTES",
        style: { textAlign: "right", width: "118px", minWidth: "118px" },
        sortable: true,
      },
    ],
    "VOTES",
  );

  useEffect(() => {
    setIsLoading(true);
    nextApi.fetch(
      `statistics/democracy/delegatee/${delegatee}/delegators`,
      {
        ...getSortParams(sortedColumn),
        page,
        pageSize,
      },
    ).then(({ result }) => {
      setBeenDelegatedList(result);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [delegatee, page, sortedColumn]);

  const rows = (beenDelegatedList?.items || []).map((item) => [
      <Flex key="account" style={{ maxWidth: "124px", overflow: "hidden" }}>
        <User add={item.account} fontSize={14} />
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
    ]);

  return (
    <VStack space={16}>
      <ListWrapper>
        <StyledList columns={columns} rows={rows} loading={isLoading} />
      </ListWrapper>
      <Pagination {...pagination} />
    </VStack>
  );
}
