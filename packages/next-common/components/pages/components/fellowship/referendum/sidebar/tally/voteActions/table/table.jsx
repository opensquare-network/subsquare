import { desktopColumns, mobileColumns } from "./columns";
import {
  useDesktopItemSize,
  useMobileItemSize,
} from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/useListItemSize";
import useColumns from "next-common/components/styledList/useColumns";
import { useEffect, useMemo } from "react";
import VirtualList from "next-common/components/dataList/virtualList";
import { cn } from "next-common/utils";

export default function Table({
  search,
  loading,
  maxImpactVotes,
  setSortedColumn,
  sortedVoteActions,
  sortedColumn,
}) {
  return (
    <>
      <div className="max-md:hidden">
        <DesktopTable
          setSortedColumn={setSortedColumn}
          voteActions={sortedVoteActions}
          listKey={`desktop-${search}-${sortedColumn}`}
          maxImpactVotes={maxImpactVotes}
          loading={loading}
        />
      </div>
      <div className="hidden max-md:block">
        <MobileTable
          voteActions={sortedVoteActions}
          loading={loading}
          maxImpactVotes={maxImpactVotes}
          listKey={`mobile-${search}-${sortedColumn}`}
        />
      </div>
    </>
  );
}

function DesktopTable({
  voteActions,
  listKey,
  setSortedColumn,
  maxImpactVotes,
  loading,
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
      listHeight={600}
      overscanCount={3}
      noDataText="No data"
      className="scrollbar-hidden h-full"
    />
  );
}

function MobileTable({ voteActions, loading, maxImpactVotes, listKey }) {
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
      listHeight={600}
      overscanCount={3}
      noDataText="No data"
    />
  );
}
