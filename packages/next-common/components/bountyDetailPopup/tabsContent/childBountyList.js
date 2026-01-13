import React, { useMemo, useState, useEffect } from "react";
import useChildBountiesWithPage from "next-common/hooks/useChildBountiesWithPage";
import DataList from "next-common/components/dataList";
import Pagination from "next-common/components/pagination";
import { isNil } from "lodash-es";
import { cn } from "next-common/utils";
import { useAsync } from "react-use";
import ListPostTitle from "next-common/components/postList/postTitle";
import { toTreasuryChildBountyListItem } from "next-common/utils/viewfuncs";
import Tag from "next-common/components/tags/state/tag";
import businessCategory from "next-common/utils/consts/business/category";
import { PostItemTitleValue } from "next-common/components/postList/common";

let pageSize = 25;

function ChildBountyList({ childBounties, bountyIndex, className = "" }) {
  const [data, setData] = useState(childBounties);
  const { isLoading, childBountiesPageData, fetchChildBountiesWithPage } =
    useChildBountiesWithPage(bountyIndex);
  const [page, setPage] = useState(1);
  const total = childBounties.total;

  useEffect(() => {
    if (isNil(childBountiesPageData)) return;
    setData(childBountiesPageData);
  }, [childBountiesPageData]);

  useAsync(async () => {
    fetchChildBountiesWithPage(page, pageSize);
  }, [page]);

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      total: total ?? 0,
      onPageChange,
    }),
    [page, total],
  );

  function onPageChange(e, target) {
    e.preventDefault();
    setPage(target);
  }

  const columns = [
    {
      name: "Title",
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
    const formatItem = toTreasuryChildBountyListItem(item);
    return [
      <ListPostTitle
        className="text14Medium"
        key={index + "title"}
        data={formatItem}
        href={formatItem.detailLink}
      />,
      <div key={index + "value"} className="flex justify-end">
        <PostItemTitleValue data={formatItem} />
      </div>,
      <Tag
        key={index + "status"}
        state={formatItem.state}
        category={businessCategory.treasuryChildBounties}
      />,
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
