import ExplorerLink from "next-common/components/links/explorerLink";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import { VOTE_ACTION_TYPES } from "../common";

export default function ActionField({ type, indexer }) {
  return (
    <div className="flex flex-col">
      <div className="text-textPrimary text14Medium">
        {VOTE_ACTION_TYPES[type]}
      </div>
      <ExplorerLink indexer={indexer}>
        <div className="text-textTertiary hover:underline">
          <span>{formatDateTime(indexer?.blockTime)}</span>
          <span>&nbsp;↗</span>
        </div>
      </ExplorerLink>
    </div>
  );
}
