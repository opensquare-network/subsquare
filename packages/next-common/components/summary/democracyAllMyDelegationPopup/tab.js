import React, { useState } from "react";
import Pagination from "next-common/components/pagination";
import VStack from "../../styled/vStack";
import AllMyDelegationPopupList from "./list";

export default function AllMyDelegationPopupTabList({ myDelegationList }) {
  const [page, setPage] = useState(1);
  const pageSize = 50;

  function onPageChange(e, target) {
    e.preventDefault();
    setPage(target);
  }

  const pagination = {
    page,
    pageSize,
    total: myDelegationList?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <VStack space={16}>
      <AllMyDelegationPopupList
        myDelegationList={myDelegationList.slice(sliceFrom, sliceTo)}
      />
      <Pagination {...pagination} />
    </VStack>
  );
}
