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
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import { p_12_medium } from "next-common/styles/componentCss";
import startCase from "lodash.startcase";
import ScrollerX from "next-common/components/styled/containers/scrollerX";

const ConvictionText = styled.span`
  width: 40px;
  color: var(--textTertiary);
`;

const TrackNameText = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  white-space: nowrap;
  padding: 2px 8px;

  background: var(--neutral200);
  border-radius: 10px;

  ${p_12_medium}

  text-align: center;
  color: var(--textSecondary);
`;

const MyPopupListWrapper = styled(PopupListWrapper)`
  thead,
  tr {
    width: unset !important;
  }
  tr.empty-tr {
    width: 100% !important;
  }
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
    case "TRACK":
      colName = "trackId";
      break;
    default:
      colName = "account";
  }

  return { sort: JSON.stringify([colName, "desc"]) };
}

export default function DelegationTabList({ delegatee }) {
  const [beenDelegatedList, setBeenDelegatedList] = useState(EmptyList);
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
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
      {
        name: "ADDRESS",
        style: { textAlign: "left", width: "232px", minWidth: "232px" },
      },
      {
        name: "TRACK",
        style: { textAlign: "left", width: "144px", minWidth: "144px" },
        sortable: true,
      },
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
    nextApi
      .fetch(`referenda/delegatee/${delegatee}/delegators`, {
        ...getSortParams(sortedColumn),
        page,
        pageSize,
      })
      .then(({ result }) => {
        setBeenDelegatedList(result);
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, [delegatee, page, sortedColumn]);

  const rows = (beenDelegatedList?.items || []).map((item) => [
    <Flex key="account">
      <User add={item.account} fontSize={14} maxWidth={232} />
    </Flex>,
    <TrackNameText key="track">{startCase(item.trackName)}</TrackNameText>,
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
      <ScrollerX>
        <MyPopupListWrapper>
          <StyledList columns={columns} rows={rows} loading={!isLoaded} />
        </MyPopupListWrapper>
      </ScrollerX>
      <Pagination {...pagination} />
    </VStack>
  );
}
