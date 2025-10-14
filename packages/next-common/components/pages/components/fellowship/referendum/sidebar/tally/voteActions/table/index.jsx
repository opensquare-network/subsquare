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

function getActionTypeLabel(type) {
  switch (type) {
    case 1:
      return "Voted";
    default:
      return "Unknown";
  }
}

function ActionField({ type, indexer, className }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="text-textPrimary text14Medium">
        {getActionTypeLabel(type)}
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

function Table({ voteActions, loading }) {
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
      className: "text-right",
    },
  ];

  const rows = (voteActions || []).map(({ who, type, indexer }) => {
    return [
      <AddressUser key="who" add={who} />,
      <ActionField key="type" type={type} indexer={indexer} />,
      "--",
    ];
  });

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
