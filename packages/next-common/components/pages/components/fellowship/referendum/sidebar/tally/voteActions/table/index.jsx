import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { useCallback, useState, memo } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import useSortVoteActions from "../useSortVoteActions";
import DataList from "next-common/components/dataList";
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
      <div className="text-textPrimary text14Medium">
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

function VoteDetailField({ vote, preVote }) {
  if (preVote) {
    return <VoteChangeDetail vote={vote} preVote={preVote} />;
  }
  return <VoteDetail vote={vote} />;
}

function ImpactVotesProgressDisplay({ vote, maxImpactVotes }) {
  //TODO: handle preVote change impact
  const impactVotes = vote.isAye ? BigInt(vote.votes) : -BigInt(vote.votes);
  return (
    <ProgressDisplay
      impactVotes={impactVotes}
      maxImpactVotes={maxImpactVotes}
    />
  );
}

function TallyVotesDisplay({ vote }) {
  //TODO: handle preVote change impact
  const { color } = VOTE_TYPE_CONFIG[vote.isAye ? "aye" : "nay"];

  return (
    <div>
      <span>Tally: </span>
      <div className={cn(color, "inline-flex")}>
        <span>
          {vote.isAye ? "+" : "-"}
          {vote.votes}
        </span>
      </div>
    </div>
  );
}

function ImpactVotesField({ vote, preVote, type, maxImpactVotes }) {
  return (
    <div className="text-textTertiary text14Medium max-md:flex max-md:flex-col max-md:items-end">
      <ImpactVotesProgressDisplay
        vote={vote}
        preVote={preVote}
        type={type}
        maxImpactVotes={maxImpactVotes}
      />
      <TallyVotesDisplay vote={vote} preVote={preVote} type={type} />
    </div>
  );
}

function Table({ voteActions, loading }) {
  //TODO: impact column sorting

  const columns = [
    {
      name: "Account",
      className: "",
    },
    {
      name: "Action",
      width: 160,
      className: "text-left",
    },
    {
      name: "Detail",
      width: 120,
      className: "text-left",
    },
    {
      name: "Impact",
      className: "w-[176px] text-right",
      sortable: true,
    },
  ];

  const rows = (voteActions || []).map(
    ({ who, type, indexer, data: { vote, preVote } }) => {
      return [
        <AddressUser key="who" add={who} />,
        <ActionField
          key="type"
          type={type}
          indexer={indexer}
          preVote={preVote}
        />,
        <VoteDetailField key="detail" vote={vote} preVote={preVote} />,
        <ImpactVotesField
          key="impact"
          vote={vote}
          preVote={preVote}
          type={type}
        />,
      ];
    },
  );

  return (
    <DataList
      bordered
      columns={columns}
      noDataText="No Actions"
      rows={rows}
      loading={loading}
    />
  );
}

export const useReferendumActions = () => {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);
  return { loading, voteActions };
};

function VoteActionsTable({ search = "" }) {
  const [sortedColumn, setSortedColumn] = useState("");
  const { loading, voteActions = [] } = useReferendumActions();

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);
  const sortedVoteActions = useSortVoteActions(
    filteredVoteActions,
    sortedColumn,
  );

  return (
    <Table
      voteActions={sortedVoteActions}
      loading={loading}
      setSortedColumn={setSortedColumn}
    />
  );
}

export default memo(VoteActionsTable);
