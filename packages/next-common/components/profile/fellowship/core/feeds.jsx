import { SystemLoading } from "@osn/icons/subsquare";
import { createFellowshipCoreFeedsRows } from "next-common/components/fellowship/core/feeds/list";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import Pagination from "next-common/components/pagination";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import { usePageProps } from "next-common/context/page";
import useFellowshipCoreFeeds from "next-common/hooks/fellowship/core/useFellowshipCoreFeeds";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfileFellowshipCoreFeeds({
  showUserInfo = true,
  noDataText = "",
  firstPageFeeds,
}) {
  const router = useRouter();
  const [page, setPage] = useState(parseInt(router.query.page || 1));

  const { value = {}, loading } = useFellowshipCoreFeeds({
    page,
    firstPageFeeds,
  });

  const rows = createFellowshipCoreFeedsRows(value?.items, { showUserInfo });

  return (
    <div>
      {loading ? (
        <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto text-textDisabled" />
      ) : (
        <FellowshipFeedItems rows={rows} noDataText={noDataText || "No data"} />
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

export function ProfileFellowshipCoreFeedsServerFirst(props) {
  const { fellowshipFeeds, ambassadorFeeds } = usePageProps();
  const { section } = useCollectivesContext();
  if (section === "fellowship" && fellowshipFeeds?.items?.length > 0) {
    return (
      <ProfileFellowshipCoreFeeds {...props} firstPageFeeds={fellowshipFeeds} />
    );
  }
  if (section === "ambassador" && ambassadorFeeds?.items?.length > 0) {
    return (
      <ProfileFellowshipCoreFeeds {...props} firstPageFeeds={ambassadorFeeds} />
    );
  }
  return <ProfileFellowshipCoreFeeds {...props} />;
}
