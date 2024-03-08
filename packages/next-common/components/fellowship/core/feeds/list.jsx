import FellowshipCoreFeedsListEvent from "./event";
import { orderBy } from "lodash-es";
import FellowshipFeedSuffix from "next-common/components/fellowship/feeds/suffix";
import FellowshipFeedsPanel from "next-common/components/fellowship/feeds/list";

export default function FellowshipCoreFeedsList({ feeds = {} }) {
  const orderedItems = orderBy(
    feeds?.items || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  const rows = orderedItems?.map?.((item) => {
    return [
      <FellowshipCoreFeedsListEvent key="event" feed={item} className="pr-2" />,
      <FellowshipFeedSuffix key="block-info" indexer={item?.indexer} />,
    ];
  });

  return <FellowshipFeedsPanel feeds={feeds} rows={rows} />;
}
