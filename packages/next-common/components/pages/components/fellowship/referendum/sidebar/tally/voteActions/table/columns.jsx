import { AddressUser } from "next-common/components/user";
import { cn } from "next-common/utils";
import ExplorerLink from "next-common/components/links/explorerLink";
import { formatTimeAgo } from "next-common/utils/viewfuncs/formatTimeAgo";
import Tooltip from "next-common/components/tooltip";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import {
  ChangeVoteWrapper,
  VoteDetailRow,
  VoteLabel,
} from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table/fields/detail";
import { ProgressDisplay } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table/fields/impact";
import { VOTE_TYPE_CONFIG } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/common";

function getActionTypeLabel(type, preVote) {
  if (type === 1) {
    if (preVote) {
      return "Change Vote";
    }
    return "Vote";
  }
  return "";
}

function ActionField({ type, indexer, className, preVote }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-textPrimary text14Medium text-end md:text-start ">
        {getActionTypeLabel(type, preVote)}
      </div>
      <ExplorerLink indexer={indexer} style={{ fontSize: "12px" }}>
        <Tooltip content={formatTimeAgo(indexer?.blockTime)}>
          <div className="text-textTertiary hover:underline">
            <span>{formatDateTime(indexer?.blockTime)}</span>
            <span>&nbsp;↗</span>
          </div>
        </Tooltip>
      </ExplorerLink>
    </div>
  );
}

function VoteChangeDetail({ vote, preVote }) {
  const pre = <VoteDetail vote={preVote} />;
  const current = <VoteDetail vote={vote} />;
  return <ChangeVoteWrapper pre={pre} current={current} />;
}

function VoteDetail({ vote }) {
  const voteType = vote?.isAye ? "aye" : "nay";
  return (
    <VoteDetailRow label={<VoteLabel type={voteType} />}>
      ({vote?.votes})
    </VoteDetailRow>
  );
}

function ImpactVotesField({ vote, maxImpactVotes }) {
  const impactVotes = vote.isAye ? BigInt(vote.votes) : -BigInt(vote.votes);
  const { color } = VOTE_TYPE_CONFIG[vote.isAye ? "aye" : "nay"];

  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end pr-2">
      <ProgressDisplay
        impactVotes={impactVotes}
        maxImpactVotes={BigInt(maxImpactVotes)}
      />
      <div>
        <span>Tally: </span>
        <div className={cn(color, "inline-flex")}>
          <span>
            {vote.isAye ? "+" : "-"}
            {vote.votes}
          </span>
        </div>
      </div>
    </div>
  );
}

export const desktopColumns = [
  {
    name: "Account",
    className: "",
    render: ({ who }) => <AddressUser key="who" add={who} />,
  },
  {
    name: "Action",
    width: 160,
    className: "text-left",
    render: ({ type, indexer, data: { preVote } }) => (
      <ActionField key="type" type={type} indexer={indexer} preVote={preVote} />
    ),
  },
  {
    name: "Detail",
    width: 120,
    className: "text-left",
    render: ({ data: { vote, preVote } }) => {
      if (preVote) {
        return <VoteChangeDetail vote={vote} preVote={preVote} />;
      }
      return <VoteDetail vote={vote} />;
    },
  },
  {
    name: "Impact",
    key: "impact",
    className: "w-[176px] text-right",
    sortable: true,
    render: ({ maxImpactVotes, data: { vote } }) => (
      <ImpactVotesField vote={vote} maxImpactVotes={maxImpactVotes} />
    ),
  },
];

function MobileRow({ label, children }) {
  return (
    <div className="flex flex-row justify-between pr-2">
      {label && (
        <span className="text14Medium text-textTertiary flex items-center">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}

export const mobileColumns = [
  {
    name: "Account",
    className: "",
    render: ({ who }) => <AddressUser key="who" add={who} />,
  },
  {
    render: ({ type, indexer, data: { preVote } }) => (
      <MobileRow label={"Action"}>
        <ActionField
          key="type"
          type={type}
          indexer={indexer}
          preVote={preVote}
        />
      </MobileRow>
    ),
  },
  {
    render: ({ data: { vote, preVote } }) => (
      <MobileRow label={"Detail"}>
        {preVote ? (
          <VoteChangeDetail vote={vote} preVote={preVote} />
        ) : (
          <VoteDetail vote={vote} />
        )}
      </MobileRow>
    ),
  },
  {
    render: ({ maxImpactVotes, data: { vote } }) => (
      <MobileRow label={"Impact"}>
        <ImpactVotesField vote={vote} maxImpactVotes={maxImpactVotes} />
      </MobileRow>
    ),
  },
];
