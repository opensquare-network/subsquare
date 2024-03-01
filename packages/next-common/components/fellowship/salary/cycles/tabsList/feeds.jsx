import { usePageProps } from "next-common/context/page";
import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import { createFellowshipSalaryFeedsRows } from "../../feeds/list";
import Pagination from "next-common/components/pagination";

export function FellowshipSalaryFeedsList({ feeds }) {
  const rows = createFellowshipSalaryFeedsRows(feeds?.items);
  return (
    <div className="mx-[-24px]">
      <FellowshipFeedItems rows={rows} />
      <Pagination
        page={feeds.page}
        pageSize={feeds.pageSize}
        total={feeds.total}
      />
    </div>
  );
}

export function useFellowshipSalaryCycleFeedsTabItem() {
  const { id, feeds } = usePageProps();
  return {
    name: "Feeds",
    url: `/fellowship/salary/cycles/${id}/feeds`,
    activeCount: feeds?.total ?? 0,
    content: <FellowshipSalaryFeedsList feeds={feeds} />,
  };
}
