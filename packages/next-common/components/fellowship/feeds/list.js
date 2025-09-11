import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import DataList from "next-common/components/dataList";
import { cn } from "next-common/utils";
import fellowshipFeedColumns from "next-common/components/fellowship/feeds/columns";
import FellowshipFeedLeadingBar from "next-common/components/fellowship/feeds/leading";
import Pagination from "next-common/components/pagination";

export function FellowshipFeedItems({
  rows = [],
  noDataText = "No current feeds",
  loading,
}) {
  return (
    <DataList
      loading={loading}
      noDataText={noDataText}
      className={cn(
        "text14Medium",
        "[&_.datalist-head]:hidden [&_.datalist-body]:divide-y-0 [&_.datalist-body]:border-b-0",
        "[&_.datalist-item]:py-2.5",
        "[&_.datalist-desktop-item]:items-start",
        "[&_.datalist_.descriptions-item-label]:hidden",
      )}
      columns={fellowshipFeedColumns}
      rows={rows}
      renderItem={(DataListItem, idx, rows) => {
        const isLast = idx === rows.length - 1;

        return (
          <div className="flex gap-x-4 px-6 sm:hover:bg-neutral200" key={idx}>
            <FellowshipFeedLeadingBar isLast={isLast} />
            <DataListItem row={rows[idx]} />
          </div>
        );
      }}
    />
  );
}

export default function FellowshipFeedsPanel({ feeds = {}, rows }) {
  return (
    <SecondaryCard className="!px-0">
      <FellowshipFeedItems rows={rows} />

      <Pagination
        page={feeds.page}
        pageSize={feeds.pageSize}
        total={feeds.total}
      />
    </SecondaryCard>
  );
}
