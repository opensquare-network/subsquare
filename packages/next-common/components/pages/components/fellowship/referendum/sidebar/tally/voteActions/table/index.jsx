import useFellowshipReferendaActions from "../useFellowshipReferendaActions";
import { memo, useMemo, useEffect, useState, useCallback } from "react";
import { cn } from "next-common/utils";
import {
  useDesktopItemSize,
  useMobileItemSize,
} from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useListItemSize";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import useColumns from "next-common/components/styledList/useColumns";
import VirtualList from "next-common/components/dataList/virtualList";
import { desktopColumns, mobileColumns } from "./columns";

function VoteActionsTable({ search = "", listHeight = 600 }) {
  const { loading, voteActions } = useFellowshipReferendaActions();
  const [sortedColumn, setSortedColumn] = useState("");

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);

  const sortedVoteActions = useMemo(() => {
    if (sortedColumn === "Impact") {
      return [...filteredVoteActions].sort(
        (a, b) => b.data.vote.votes - a.data.vote.votes,
      );
    }
    return filteredVoteActions;
  }, [sortedColumn, filteredVoteActions]);

  return (
    <>
      <>
        <div className="max-md:hidden">
          <DesktopTable
            setSortedColumn={setSortedColumn}
            voteActions={sortedVoteActions}
            listKey={`desktop-${search}-${sortedColumn}`}
            loading={loading}
            listHeight={listHeight}
          />
        </div>
        <div className="hidden max-md:block">
          <MobileTable
            listHeight={listHeight}
            voteActions={sortedVoteActions}
            loading={loading}
            listKey={`mobile-${search}-${sortedColumn}`}
          />
        </div>
      </>
    </>
  );
}

function DesktopTable({
  listHeight,
  voteActions,
  listKey,
  setSortedColumn,
  loading,
}) {
  const getItemSize = useDesktopItemSize(voteActions);
  const { sortedColumn, columns } = useColumns(desktopColumns, "", true);
  useEffect(() => {
    setSortedColumn(sortedColumn);
  }, [sortedColumn, setSortedColumn]);

  const row = useMemo(() => {
    return voteActions?.map((item) => {
      return desktopColumns.map((col) => col.render(item));
    });
  }, [voteActions]);

  return (
    <VirtualList
      key={listKey}
      columns={columns}
      rows={row}
      loading={loading}
      variableSize={true}
      getItemSize={getItemSize}
      listHeight={listHeight}
      overscanCount={3}
      noDataText="No data"
      className="scrollbar-hidden h-full"
    />
  );
}

function MobileTable({ listHeight, voteActions, loading, listKey }) {
  const getItemSize = useMobileItemSize(voteActions);

  const columns = useMemo(() => {
    return [{ name: null }, { name: null }, { name: null }, { name: null }];
  }, []);

  const rows = useMemo(() => {
    return voteActions?.map((item) => {
      return [
        <div key={item.who} className="flex flex-col space-y-2 w-full">
          {mobileColumns.map((col, index) => (
            <div key={index}>{col.render(item)}</div>
          ))}
        </div>,
      ];
    });
  }, [voteActions]);

  return (
    <VirtualList
      className={cn(
        "[&_.datalist_.descriptions-item-label]:hidden",
        "[&_.datalist_.descriptions-item-value]:w-full",
        "scrollbar-hidden h-full",
      )}
      key={listKey}
      columns={columns}
      rows={rows}
      loading={loading}
      variableSize={true}
      getItemSize={getItemSize}
      listHeight={listHeight}
      overscanCount={3}
      noDataText="No data"
    />
  );
}

export default memo(VoteActionsTable);
