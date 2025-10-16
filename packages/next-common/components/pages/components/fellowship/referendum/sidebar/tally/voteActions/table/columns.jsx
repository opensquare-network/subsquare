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
import { useMemo } from "react";

function ActionField({
  data: {
    type,
    indexer,
    data: { preVote, vote },
  },
}) {
  const actionName = useMemo(() => {
    if (type !== 1) {
      return "";
    }
    if (preVote && preVote.isAye !== vote.isAye) {
      return "Change Vote";
    }
    return "Vote";
  }, [preVote, type, vote?.isAye]);

  return (
    <div className={cn("flex flex-col")}>
      <div className="text-textPrimary text14Medium text-end md:text-start ">
        {actionName}
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

function ImpactVotesField({ data, maxImpactVotes }) {
  const { vote, preVote } = data;

  const { votes, isAye } = useMemo(() => {
    if (preVote && preVote.isAye === vote.isAye) {
      const difference = vote.votes - preVote.votes;
      const isAye = difference > 0 ? vote.isAye : preVote.isAye;
      return {
        isAye,
        votes: Math.abs(difference),
      };
    }
    return vote;
  }, [preVote, vote]);
  const impactVotes = isAye ? BigInt(votes) : -BigInt(votes);

  const { color } = VOTE_TYPE_CONFIG[isAye ? "aye" : "nay"];

  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end pr-2">
      <ProgressDisplay
        impactVotes={impactVotes}
        maxImpactVotes={BigInt(maxImpactVotes)}
      />
      <div>
        <span>Tally: </span>
        <div className={cn(votes ? color : "text-textPrimary", "inline-flex")}>
          <span>
            {votes ? (isAye ? "+" : "-") : null}
            {votes}
          </span>
        </div>
      </div>
      <div className="text12Medium">
        <span className="">Bare Aye: </span>
        <span
          className={cn(
            isAye
              ? votes
                ? VOTE_TYPE_CONFIG.aye.color
                : "text-textPrimary"
              : "",
          )}
        >
          {isAye && votes ? "+1" : "0"}
        </span>
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
    render: (data) => <ActionField data={data} />,
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
    render: ({ maxImpactVotes, data }) => (
      <ImpactVotesField data={data} maxImpactVotes={maxImpactVotes} />
    ),
  },
];

function MobileRow({ label, children }) {
  return (
    <div className="flex flex-row justify-between pr-2">
      {label && <span className="text14Medium text-textTertiary">{label}</span>}
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
    render: (data) => (
      <MobileRow label={"Action"}>
        <ActionField data={data} />
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
    render: ({ maxImpactVotes, data }) => (
      <MobileRow label={"Impact"}>
        <ImpactVotesField data={data} maxImpactVotes={maxImpactVotes} />
      </MobileRow>
    ),
  },
];
