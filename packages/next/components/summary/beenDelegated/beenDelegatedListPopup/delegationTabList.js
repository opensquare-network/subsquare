import React, { useState } from "react";
import Popup from "next-common/components/popup/wrapper/Popup";
import ListTab, { tabs } from "./tab";
import DelegationList from "./delegationList";
import Pagination from "next-common/components/pagination";
import Column from "next-common/components/styled/column";

export default function DelegationTabList({
  directDelegationList = [],
  nestedDelegationList = [],
}) {
  const [tabIndex, setTabIndex] = useState(tabs[0].tabId);
  const [directPage, setDirectPage] = useState(1);
  const [nestedPage, setNestedPage] = useState(1);
  const pageSize = 50;

  const delegations =
    tabIndex === tabs[0].tabId ? directDelegationList : nestedDelegationList;

  function onPageChange(e, target) {
    e.preventDefault();
    if (tabIndex === "Direct") {
      setDirectPage(target);
    } else {
      setNestedPage(target);
    }
  }

  const pagination = {
    page: tabIndex === "Direct" ? directPage : nestedPage,
    pageSize,
    total: delegations?.length || 0,
    onPageChange,
  };

  const sliceFrom = (pagination.page - 1) * pageSize;
  const sliceTo = sliceFrom + pageSize;

  return (
    <Column gap={16}>
      <ListTab
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        directCount={directDelegationList?.length || 0}
        nestedCount={nestedDelegationList?.length || 0}
      />
      <DelegationList
        items={delegations.slice(sliceFrom, sliceTo)}
        loading={false}
      />
      <Pagination {...pagination} />
    </Column>
  );
}
