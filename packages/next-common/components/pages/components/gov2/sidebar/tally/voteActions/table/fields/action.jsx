import ExplorerLink from "next-common/components/links/explorerLink";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import { VOTE_ACTION_TYPES, OPENGOV_ACTIONS } from "../../common";
import { cn } from "next-common/utils";

function getActionName(type, preVote, preDelegation) {
  if (type === OPENGOV_ACTIONS.VOTE) {
    return preVote ? "Change Vote" : "Vote";
  }
  if (type === OPENGOV_ACTIONS.DELEGATED) {
    return preDelegation ? "Change Delegation" : "Delegate";
  }
  return VOTE_ACTION_TYPES[type];
}

export default function ActionField({ type, indexer, className, data }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-textPrimary text14Medium">
        {getActionName(type, data?.preVote, data?.preDelegation)}
      </div>
      <ExplorerLink indexer={indexer} style={{ fontSize: "12px" }}>
        <div className="text-textTertiary hover:underline">
          <span>{formatDateTime(indexer?.blockTime)}</span>
          <span>&nbsp;↗</span>
        </div>
      </ExplorerLink>
    </div>
  );
}
