import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { cn } from "next-common/utils";
import VirtualList from "next-common/components/dataList/virtualList";
import { useMemo, useCallback } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";

// TODO: item height
function DesktopTable({ voteActions, loading }) {
  const getItemSize = useMemo(() => {
    return (index) => {
      const item = voteActions?.[index];
      if (!item) return 60;
      return 100;
    };
  }, [voteActions]);

  const virtualColumns = useMemo(() => {
    return desktopColumns.map((col) => ({
      name: col.name,
      className: col.className,
      headClassName: col.headClassName,
      style: col.style,
      width: col.width,
    }));
  }, []);

  const virtualRows = useMemo(() => {
    return (
      voteActions?.map((item) => {
        return desktopColumns.map((col) => col.render(item));
      }) || []
    );
  }, [voteActions]);

  return (
    <VirtualList
      columns={virtualColumns}
      rows={virtualRows}
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

function MobileTable({ voteActions, loading }) {
  const getItemSize = useMemo(() => {
    return (index) => {
      const item = voteActions?.[index];
      if (!item) return 120;

      let height = 240;
      if (item.data && typeof item.data === "object") {
        height += 30;
      }
      return height;
    };
  }, [voteActions]);

  const virtualColumns = useMemo(() => {
    return [{ name: null }, { name: null }, { name: null }, { name: null }];
  }, []);

  const virtualRows = useMemo(() => {
    return (
      voteActions?.map((item) => {
        return [
          <div key={item.who} className="flex flex-col space-y-2 w-full">
            {mobileColumns.map((col, index) => (
              <div key={index}>{col.render(item)}</div>
            ))}
          </div>,
        ];
      }) || []
    );
  }, [voteActions]);

  return (
    <VirtualList
      className={cn(
        "[&_.datalist_.descriptions-item-label]:hidden",
        "[&_.datalist_.descriptions-item-value]:w-full",
        "scrollbar-hidden h-full",
      )}
      columns={virtualColumns}
      rows={virtualRows}
      loading={loading}
      variableSize={true}
      getItemSize={getItemSize}
      listHeight={600}
      overscanCount={3}
      noDataText="No data"
    />
  );
}

export default function VoteActionsTable({ search = "" }) {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions = [] } = useQueryVoteActions(referendumIndex);

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);

  return (
    <>
      <div className="max-md:hidden">
        <DesktopTable voteActions={filteredVoteActions} loading={loading} />
      </div>
      <div className="hidden max-md:block">
        <MobileTable voteActions={filteredVoteActions} loading={loading} />
      </div>
    </>
  );
}
