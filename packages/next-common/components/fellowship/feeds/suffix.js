import FellowshipFeedTime from "next-common/components/fellowship/feeds/time";
import FellowshipFeedExplorerLink from "next-common/components/fellowship/feeds/explorerLink";
import { cn } from "next-common/utils";

export default function FellowshipFeedSuffix({ indexer }) {
  return (
    <div className="flex items-center max-sm:gap-x-2">
      <FellowshipFeedTime
        indexer={indexer}
        className="w-40 text-textTertiary max-sm:w-auto text14Medium"
      />
      <FellowshipFeedExplorerLink
        indexer={indexer}
        className={cn(
          "opacity-0 group-hover/datalist-item:opacity-100 max-sm:opacity-100",
          "text-textTertiary text14Medium",
        )}
      />
    </div>
  );
}
