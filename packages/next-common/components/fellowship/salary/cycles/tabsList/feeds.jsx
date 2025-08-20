import { usePageProps } from "next-common/context/page";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import { createFellowshipSalaryFeedsRows } from "../../feeds/list";
import Pagination from "next-common/components/pagination";
import { useState } from "react";
import { fellowshipSalaryCycleFeedsApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useUpdateEffect } from "react-use";
import { SystemLoading } from "@osn/icons/subsquare";
import { defaultPageSize } from "next-common/utils/constants";

export function FellowshipSalaryFeedsList({ feeds }) {
  const { id } = usePageProps();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(feeds);
  const rows = createFellowshipSalaryFeedsRows(result?.items);
  const [loading, setLoading] = useState(false);

  function fetchData() {
    setLoading(true);
    backendApi
      .fetch(fellowshipSalaryCycleFeedsApi(id), {
        page,
        pageSize: defaultPageSize,
      })
      .then((resp) => {
        if (resp.result) {
          setResult(resp.result);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useUpdateEffect(fetchData, [page]);

  if (loading) {
    return (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  }

  return (
    <div className="mx-[-24px]">
      <FellowshipFeedItems rows={rows} />
      <Pagination
        page={page}
        pageSize={feeds.pageSize}
        total={feeds.total}
        onPageChange={(e, newPage) => {
          e.preventDefault();
          setPage(newPage);
        }}
      />
    </div>
  );
}

export function useFellowshipSalaryCycleFeedsTabItem() {
  const { feeds } = usePageProps();
  return {
    name: "Feeds",
    activeCount: feeds?.total ?? 0,
    content: <FellowshipSalaryFeedsList feeds={feeds} />,
  };
}
