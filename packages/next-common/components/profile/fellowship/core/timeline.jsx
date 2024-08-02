import { SystemLoading } from "@osn/icons/subsquare";
import { createFellowshipCoreFeedsRows } from "next-common/components/fellowship/core/feeds/list";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import Pagination from "next-common/components/pagination";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import nextApi from "next-common/services/nextApi";
import {
  ambassadorCoreFeedsApiUri,
  fellowshipCoreFeedsApiUri,
} from "next-common/services/url";
import { defaultPageSize } from "next-common/utils/constants";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAsync } from "react-use";

export default function ProfileFellowshipCoreTimeline() {
  const { id: address } = usePageProps();
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));

  let feedsApi;
  const { section } = useCollectivesContext();
  if (section === "fellowship") {
    feedsApi = fellowshipCoreFeedsApiUri;
  } else if (section === "ambassador") {
    feedsApi = ambassadorCoreFeedsApiUri;
  }

  const { value = {}, loading } = useAsync(async () => {
    if (!feedsApi) {
      return;
    }

    const resp = await nextApi.fetch(feedsApi, {
      who: address,
      page,
      pageSize: defaultPageSize,
    });

    return resp?.result;
  }, [page, address, feedsApi]);

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
