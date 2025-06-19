import { useState, useMemo, useEffect } from "react";
import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { MapDataList } from "next-common/components/dataList";
import ScrollerX from "next-common/components/styled/containers/scrollerX";
import Pagination from "next-common/components/pagination";
import { cn } from "next-common/utils";

export default function VoteActionsTable() {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [voteActions]);

  const onPageChange = (e, target) => {
    e.preventDefault();
    setPage(target);
  };

  const pagination = useMemo(
    () => ({
      page,
      pageSize,
      total: voteActions?.length || 0,
      onPageChange,
    }),
    [page, pageSize, voteActions?.length],
  );

  const sliceFrom = useMemo(
    () => (pagination.page - 1) * pageSize,
    [pageSize, pagination.page],
  );
  const sliceTo = sliceFrom + pageSize;

  const pageItems = useMemo(() => {
    return voteActions?.slice(sliceFrom, sliceTo) || [];
  }, [voteActions, sliceFrom, sliceTo]);

  return (
    <>
      <ScrollerX>
        <MapDataList
          className="max-md:hidden"
          columnsDef={desktopColumns}
          data={pageItems}
          loading={loading}
          noDataText="No data"
        />
        <MapDataList
          className={cn(
            "hidden max-md:block",
            "[&_.datalist_.descriptions-item-label]:hidden",
            "[&_.datalist_.descriptions-item-value]:w-full",
          )}
          columnsDef={mobileColumns}
          data={pageItems}
          loading={loading}
          noDataText="No data"
        />
      </ScrollerX>
      {voteActions?.length > 0 && <Pagination {...pagination} />}
    </>
  );
}
