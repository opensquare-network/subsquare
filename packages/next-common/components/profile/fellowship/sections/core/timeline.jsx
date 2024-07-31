import { SystemLoading } from "@osn/icons/subsquare";
import { createFellowshipCoreFeedsRows } from "next-common/components/fellowship/core/feeds/list";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import Pagination from "next-common/components/pagination";
import { usePageProps } from "next-common/context/page";
import { useUrlSearchParams } from "next-common/hooks/useUrlSearchParams";
import nextApi from "next-common/services/nextApi";
import { fellowshipCoreFeedsApiUri } from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useAsync } from "react-use";

export default function ProfileFellowshipCoreSectionTimeline() {
  const { id: address } = usePageProps();
  const [{ page }] = useUrlSearchParams();

  const { value = {}, loading } = useAsync(async () => {
    const resp = await nextApi.fetch(fellowshipCoreFeedsApiUri, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    if (resp.result) {
      return resp.result;
    }
  }, [page, address]);

  if (loading) {
    return (
      <div className="flex justify-center">
        <SystemLoading className="text-textDisabled" />
      </div>
    );
  }

  const rows = createFellowshipCoreFeedsRows(value?.items);

  return (
    <div>
      <FellowshipFeedItems rows={rows} noDataText="No data" />

      <Pagination
        page={value?.page}
        pageSize={value?.pageSize}
        total={value?.total}
      />
    </div>
  );
}
