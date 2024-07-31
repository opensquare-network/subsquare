import { SystemLoading } from "@osn/icons/subsquare";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import { createFellowshipSalaryFeedsRows } from "next-common/components/fellowship/salary/feeds/list";
import Pagination from "next-common/components/pagination";
import { usePageProps } from "next-common/context/page";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";
import nextApi from "next-common/services/nextApi";
import { fellowshipSalaryFeedsApi } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync, useUnmount } from "react-use";

export default function ProfileFellowshipSalarySectionTimeline() {
  const { id: address } = usePageProps();
  const [{ page }, , updateParams] = useUrlSearchParams();

  useUnmount(() => {
    updateParams({ page: 1 });
  });

  const { value = {}, loading } = useAsync(async () => {
    const resp = await nextApi.fetch(fellowshipSalaryFeedsApi, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    return resp?.result;
  }, [page, address]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <SystemLoading className="text-textDisabled" />
      </div>
    );
  }

  const rows = createFellowshipSalaryFeedsRows(value?.items);

  return (
    <div>
      <FellowshipFeedItems rows={rows} noDataText="No data" />

      <Pagination
        page={value?.page}
        pageSize={value?.pageSize}
        total={value?.total}
        shallow
      />
    </div>
  );
}
