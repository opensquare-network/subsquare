import { orderBy } from "lodash-es";
import FellowshipFeedSuffix from "next-common/components/fellowship/feeds/suffix";
import FellowshipSalaryFeed from "next-common/components/fellowship/salary/feeds/events";
import FellowshipFeedsPanel from "next-common/components/fellowship/feeds/list";

export function createFellowshipSalaryFeedsRows(feeds) {
  const orderedItems = orderBy(
    feeds || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  return orderedItems?.map?.((item) => {
    return [
      <FellowshipSalaryFeed key="feed" feed={item} className="pr-2" />,
      <FellowshipFeedSuffix key="block-info" indexer={item?.indexer} />,
    ];
  });
}

export default function FellowshipSalaryFeedsList({ feeds = {} }) {
  const rows = createFellowshipSalaryFeedsRows(feeds?.items);
  return <FellowshipFeedsPanel feeds={feeds} rows={rows} />;
}
