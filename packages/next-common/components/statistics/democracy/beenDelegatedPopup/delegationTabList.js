import React, { useState } from "react";
import DelegationList from "./delegationList";
import Pagination from "next-common/components/pagination";
import VStack from "next-common/components/styled/vStack";
import styled from "styled-components";

const ListWrapper = styled.div`
  display: flex;
  overflow-x: auto;
`;

export default function DelegationTabList({ beenDelegatedList }) {
  const [page, setPage] = useState(1);
  const pageSize = 50;

  function onPageChange(e, target) {
    e.preventDefault();
    setPage(target);
  }

  const pagination = {
    page,
    pageSize,
    total: beenDelegatedList?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <VStack space={16}>
      <ListWrapper>
        <DelegationList items={beenDelegatedList?.slice(sliceFrom, sliceTo)} />
      </ListWrapper>
      <Pagination {...pagination} />
    </VStack>
  );
}
