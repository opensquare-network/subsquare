import React, { useMemo, useState, useEffect } from "react";
import useChildBountiesWithPage from "next-common/components/treasury/bounty/bountyCardPanel/hooks/useChildBountiesWithPage";
import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { useAsync } from "react-use";
//TODO: show data
function ChildBountyList({ childBounties, bountyIndex, className = "" }) {
  const [data, setData] = useState(childBounties);
  const { isLoading, childBountiesPageData, fetchChildBountiesWithPage } =
    useChildBountiesWithPage(bountyIndex);
  const [page, setPage] = useState(1);
  let pageSize = 5;
  const total = childBounties.total;

  useEffect(() => {
    if (isNil(childBountiesPageData)) return;
    setData(childBountiesPageData);
  }, [childBountiesPageData]);

  useAsync(async () => {
    if (page === 1) {
      setData(childBounties);
    } else {
      fetchChildBountiesWithPage(page);
    }
  }, [page]);

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      total: total ?? 0,
      onPageChange,
    }),
    [page, pageSize, total],
  );

  function onPageChange(e, target) {
    e.preventDefault();
    setPage(target);
  }

  const columns = [
    {
      name: "Referendum",
      style: { minWidth: "50%", textAlign: "left" },
    },
    {
      name: "Value",
      style: { width: "25%", textAlign: "right" },
    },
    {
      name: "Status",
      style: { width: "25%", textAlign: "right" },
    },
  ];

  const rows = data?.items?.map((item, index) => {
    return [
      <span key={index + "referenda"}> title </span>,
      <span key={index + "value"}> value</span>,
      <span key={index + "status"}> status</span>,
    ];
  });

  return (
    <div className={cn(className)}>
      <DataList
        contentClassName="!max-h-max"
        columns={columns}
        rows={rows}
        loading={isLoading}
      />
      <Pagination {...pagination} />
    </div>
  );
}

export default React.memo(ChildBountyList);
