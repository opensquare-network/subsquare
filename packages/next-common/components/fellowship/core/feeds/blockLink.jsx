import { InfoBlock } from "@osn/icons/subsquare";
import ExplorerLink from "next-common/components/links/explorerLink";
import { cn } from "next-common/utils";

export default function FellowshipCoreFeedsListBlockLink({
  feed,
  className = "",
}) {
  return (
    <div className={cn("flex items-center", "[&_a]:underline", className)}>
      <InfoBlock className="w-4 h-4 mr-1 [&_path]:stroke-textTertiary" />
      <ExplorerLink indexer={feed?.indexer}>
        {feed?.indexer?.blockHeight?.toLocaleString?.()}
      </ExplorerLink>
      ↗
    </div>
  );
}
