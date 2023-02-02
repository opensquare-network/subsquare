import React, { useState } from "react";
import DelegationList from "./delegationList";
import Pagination from "next-common/components/pagination";
import VStack from "../../../styled/vStack";

export default function DelegationTabList({ beenDelegatedList, isLoading }) {
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
      <DelegationList
        items={beenDelegatedList.slice(sliceFrom, sliceTo)}
        loading={isLoading}
      />
      <Pagination {...pagination} />
    </VStack>
  );
}
