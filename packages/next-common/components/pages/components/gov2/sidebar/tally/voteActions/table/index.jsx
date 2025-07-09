import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { cn } from "next-common/utils";
import VirtualList from "next-common/components/dataList/virtualList";
import { useMemo, useCallback, useState, useEffect, memo } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import { useDesktopItemSize, useMobileItemSize } from "../useListItemSize";
import useMaxImpactVotes from "../useMaxImpactVotes";
import useColumns from "next-common/components/styledList/useColumns";
import useSortVoteActions from "../useSortVoteActions";

function DesktopTable({
  voteActions,
  loading,
  listHeight = 600,
  maxImpactVotes,
  setSortedColumn,
  listKey,
}) {
  const getItemSize = useDesktopItemSize(voteActions);
  const { sortedColumn, columns } = useColumns(desktopColumns, "", true);
  useEffect(() => {
    setSortedColumn(sortedColumn);
  }, [sortedColumn, setSortedColumn]);

  const row = useMemo(() => {
    return voteActions?.map((item) => {
      const newItem = { ...item, maxImpactVotes };
      return desktopColumns.map((col) => col.render(newItem));
    });
  }, [voteActions, maxImpactVotes]);

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

function MobileTable({
  voteActions,
  loading,
  listHeight = 600,
  maxImpactVotes,
  listKey,
}) {
  const getItemSize = useMobileItemSize(voteActions);

  const columns = useMemo(() => {
    return [{ name: null }, { name: null }, { name: null }, { name: null }];
  }, []);

  const rows = useMemo(() => {
    return (
      voteActions?.map((item) => {
        const newItem = { ...item, maxImpactVotes };
        return [
          <div key={item.who} className="flex flex-col space-y-2 w-full">
            {mobileColumns.map((col, index) => (
              <div key={index}>{col.render(newItem)}</div>
            ))}
          </div>,
        ];
      }) || []
    );
  }, [maxImpactVotes, voteActions]);

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

function VoteActionsTable({ search = "", listHeight }) {
  const [sortedColumn, setSortedColumn] = useState("");
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions = [] } = useQueryVoteActions(referendumIndex);
  const maxImpactVotes = useMaxImpactVotes(voteActions);

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);
  const sortedVoteActions = useSortVoteActions(
    filteredVoteActions,
    sortedColumn,
  );

  return (
    <>
      <div className="max-md:hidden">
        <DesktopTable
          voteActions={sortedVoteActions}
          loading={loading}
          listHeight={listHeight}
          maxImpactVotes={maxImpactVotes}
          setSortedColumn={setSortedColumn}
          listKey={`desktop-${search}-${sortedColumn}`}
        />
      </div>
      <div className="hidden max-md:block">
        <MobileTable
          voteActions={sortedVoteActions}
          loading={loading}
          listHeight={listHeight}
          maxImpactVotes={maxImpactVotes}
          listKey={`mobile-${search}-${sortedColumn}`}
        />
      </div>
    </>
  );
}

export default memo(VoteActionsTable);
