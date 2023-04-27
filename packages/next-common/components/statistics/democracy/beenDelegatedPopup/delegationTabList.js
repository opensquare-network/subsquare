import React, { useEffect, useState } from "react";
import DelegationList from "./delegationList";
import Pagination from "next-common/components/pagination";
import VStack from "next-common/components/styled/vStack";
import styled from "styled-components";
import nextApi from "next-common/services/nextApi";
import { EmptyList } from "next-common/utils/constants";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
`;

export default function DelegationTabList({ delegatee }) {
  const [beenDelegatedList, setBeenDelegatedList] = useState(EmptyList);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    setIsLoading(true);
    nextApi.fetch(
      `statistics/democracy/delegatee/${delegatee}/delegators`,
      {
        page,
        pageSize,
      },
    ).then(({ result }) => {
      setBeenDelegatedList(result);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [delegatee, page]);

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

  return (
    <VStack space={16}>
      <ListWrapper>
        <DelegationList items={beenDelegatedList?.items} loading={isLoading} />
      </ListWrapper>
      <Pagination {...pagination} />
    </VStack>
  );
}
