import { cn } from "next-common/utils";
import { InfoBlock } from "@osn/icons/subsquare";
import ExplorerLink from "next-common/components/links/explorerLink";

export default function FellowshipFeedExplorerLink({
  indexer,
  className = "",
}) {
  return (
    <div className={cn("flex items-center", "[&_a]:underline", className)}>
      <InfoBlock className="w-4 h-4 mr-1 [&_path]:stroke-textTertiary" />
      <ExplorerLink indexer={indexer}>
        {indexer?.blockHeight?.toLocaleString?.()}
      </ExplorerLink>
      ↗
    </div>
  );
}
