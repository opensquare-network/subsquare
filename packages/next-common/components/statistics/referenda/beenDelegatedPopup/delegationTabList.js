import { useEffect, useState } from "react";
import Pagination from "next-common/components/pagination";
import VStack from "next-common/components/styled/vStack";
import styled from "styled-components";
import { backendApi } from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";
import useColumns from "next-common/components/styledList/useColumns";
import Flex from "next-common/components/styled/flex";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import PopupListWrapper from "next-common/components/styled/popupListWrapper";
import AddressUser from "next-common/components/user/addressUser";
import { startCase } from "lodash-es";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import tw from "tailwind-styled-components";
import DataList from "next-common/components/dataList";
import CapitalListItem from "next-common/components/dataList/capitalListItem";

const TrackNameText = tw.div`
  inline-flex items-center flex-nowrap
  whitespace-nowrap
  py-0.5 px-2
  bg-neutral200
  rounded-[10px]
  text12Medium text-center text-textSecondary
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
    backendApi
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
      <AddressUser add={item.account} maxWidth={232} />
    </Flex>,
    <TrackNameText key="track">{startCase(item.trackName)}</TrackNameText>,
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
  ]);

  return (
    <VStack space={16}>
      <ScrollerX>
        <MyPopupListWrapper>
          <DataList columns={columns} rows={rows} loading={!isLoaded} />
        </MyPopupListWrapper>
      </ScrollerX>
      <Pagination {...pagination} />
    </VStack>
  );
}
