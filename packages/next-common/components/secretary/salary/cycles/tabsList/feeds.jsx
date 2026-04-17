import { usePageProps } from "next-common/context/page";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import { createFellowshipSalaryFeedsRows } from "next-common/components/fellowship/salary/feeds/list";
import Pagination from "next-common/components/pagination";
import { useState } from "react";
import { secretarySalaryCycleFeedsApi } from "next-common/services/url";
import { backendApi } from "next-common/services/nextApi";
import { useUpdateEffect } from "react-use";
import { defaultPageSize } from "next-common/utils/constants";

function SecretarySalaryFeedsList({ feeds }) {
  const { id } = usePageProps();
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(feeds);
  const rows = createFellowshipSalaryFeedsRows(result?.items);
  const [loading, setLoading] = useState(false);

  function fetchData() {
    setLoading(true);
    backendApi
      .fetch(secretarySalaryCycleFeedsApi(id), {
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

  return (
    <div className="mx-[-24px]">
      <FellowshipFeedItems loading={loading} rows={rows} />
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

export function useSecretarySalaryCycleFeedsTabItem() {
  const { feeds } = usePageProps();
  return {
    name: "Feeds",
    activeCount: feeds?.total ?? 0,
    content: <SecretarySalaryFeedsList feeds={feeds} />,
  };
}
