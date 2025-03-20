import FellowshipCoreFeedsListEvent from "./event";
import { orderBy } from "lodash-es";
import FellowshipFeedSuffix from "next-common/components/fellowship/feeds/suffix";
import FellowshipFeedsPanel from "next-common/components/fellowship/feeds/list";

export function createFellowshipCoreFeedsRows(feeds, { showUserInfo = true }) {
  const orderedItems = orderBy(
    feeds || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  return orderedItems?.map?.((item) => {
    return [
      <FellowshipCoreFeedsListEvent
        key="event"
        feed={item}
        className="pr-2"
        showUserInfo={showUserInfo}
      />,
      <FellowshipFeedSuffix key="block-info" indexer={item?.indexer} />,
    ];
  });
}

export default function FellowshipCoreFeedsList({ feeds = {} }) {
  const rows = createFellowshipCoreFeedsRows(feeds?.items);
  return <FellowshipFeedsPanel feeds={feeds} rows={rows} />;
}
