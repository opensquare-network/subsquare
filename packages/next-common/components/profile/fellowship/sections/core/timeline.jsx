import { FellowshipFeedItems } from "next-common/components/fellowship/feeds/list";
import Pagination from "next-common/components/pagination";

export default function ProfileFellowshipCoreSectionTimeline() {
  const rows = [];

  return (
    <div>
      <FellowshipFeedItems rows={rows} noDataText="No data" />

      <div className="mt-2">
        <Pagination />
      </div>
    </div>
  );
}
