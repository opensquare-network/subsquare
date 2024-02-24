import orderBy from "lodash.orderby";
import FellowshipFeedSuffix from "next-common/components/fellowship/feeds/suffix";
import FellowshipSalaryFeed from "next-common/components/fellowship/salary/feeds/events";
import FellowshipFeedsPanel from "next-common/components/fellowship/feeds/list";

export default function FellowshipSalaryFeedsList({ feeds = {} }) {
  const orderedItems = orderBy(
    feeds?.items || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  const rows = orderedItems?.map?.((item) => {
    return [
      <FellowshipSalaryFeed key="feed" feed={item} className="pr-2" />,
      <FellowshipFeedSuffix key="block-info" indexer={item?.indexer} />,
    ];
  });

  return <FellowshipFeedsPanel feeds={feeds} rows={rows} />;
}
