import { orderBy } from "lodash-es";
import FellowshipFeedSuffix from "next-common/components/fellowship/feeds/suffix";
import FellowshipFeedsPanel from "next-common/components/fellowship/feeds/list";
import FellowshipCommonEvent from "./fellowshipCommonEvent";

export function createFellowshipFeedsRows(feeds) {
  const orderedItems = orderBy(
    feeds || [],
    ["indexer.blockHeight", "indexer.eventIndex"],
    ["desc", "desc"],
  );

  return orderedItems?.map?.((item) => {
    return [
      <div key="feed" className="pr-2 text14Medium flex gap-x-1 max-sm:block">
        <FellowshipCommonEvent feed={item} />
      </div>,
      <FellowshipFeedSuffix key="block-info" indexer={item?.indexer} />,
    ];
  });
}

export default function FellowshipFeedsList({ feeds = {} }) {
  const rows = createFellowshipFeedsRows(feeds?.items);
  return <FellowshipFeedsPanel feeds={feeds} rows={rows} />;
}
