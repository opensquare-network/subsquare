import { SystemLoading } from "@osn/icons/subsquare";
import { createFellowshipCoreFeedsRows } from "next-common/components/fellowship/core/feeds/list";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import Pagination from "next-common/components/pagination";
import { usePageProps } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import { fellowshipCoreFeedsApiUri } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAsync } from "react-use";

export default function ProfileFellowshipCoreTimeline() {
  const { id: address } = usePageProps();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));

  const { value = {}, loading } = useAsync(async () => {
    const resp = await nextApi.fetch(fellowshipCoreFeedsApiUri, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    return resp?.result;
  }, [page, address]);

  const rows = createFellowshipCoreFeedsRows(value?.items);

  return (
    <div>
      {loading ? (
        <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto text-textDisabled" />
      ) : (
        <FellowshipFeedItems rows={rows} noDataText="No data" />
      )}

      <Pagination
        page={page}
        pageSize={value?.pageSize}
        total={value?.total}
        onPageChange={(_, page) => {
          setPage(page);
        }}
        shallow
      />
    </div>
  );
}
