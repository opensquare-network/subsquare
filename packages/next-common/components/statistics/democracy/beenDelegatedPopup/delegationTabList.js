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
import DataList from "next-common/components/dataList";
import CapitalListItem from "next-common/components/dataList/capitalListItem";

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
    default:
      colName = "account";
  }

  return { sort: JSON.stringify([colName, "desc"]) };
}

export default function DelegationTabList({
  apiRoot = "democracy",
  delegatee,
}) {
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
        style: { textAlign: "left", width: "296px", minWidth: "296px" },
      },
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

  useEffect(() => {
    backendApi
      .fetch(`${apiRoot}/delegatee/${delegatee}/delegators`, {
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
  }, [delegatee, page, sortedColumn, apiRoot]);

  const rows = (beenDelegatedList?.items || []).map((item) => [
    <Flex key="account">
      <AddressUser add={item.account} maxWidth={296} />
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
  ]);

  return (
    <VStack space={16}>
      <MyPopupListWrapper>
        <DataList columns={columns} rows={rows} loading={!isLoaded} />
      </MyPopupListWrapper>
      <Pagination {...pagination} />
    </VStack>
  );
}
