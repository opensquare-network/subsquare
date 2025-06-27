import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { cn } from "next-common/utils";
import VirtualList from "next-common/components/dataList/virtualList";
import { useMemo, useCallback } from "react";
import useSearchVotes from "next-common/hooks/useSearchVotes";
import { useDesktopItemSize, useMobileItemSize } from "../useListItemSize";

function DesktopTable({ voteActions, loading, listHeight = 600 }) {
  const getItemSize = useDesktopItemSize(voteActions);

  const columns = useMemo(() => {
    return desktopColumns.map((col) => ({
      name: col.name,
      className: col?.className,
      width: col?.width,
    }));
  }, []);

  const row = useMemo(() => {
    return voteActions?.map((item) => {
      return desktopColumns.map((col) => col.render(item));
    });
  }, [voteActions]);

  return (
    <VirtualList
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

function MobileTable({ voteActions, loading, listHeight = 600 }) {
  const getItemSize = useMobileItemSize(voteActions);

  const columns = useMemo(() => {
    return [{ name: null }, { name: null }, { name: null }, { name: null }];
  }, []);

  const rows = useMemo(() => {
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

export default function VoteActionsTable({ search = "", listHeight }) {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions = [] } = useQueryVoteActions(referendumIndex);

  const getVoter = useCallback((vote) => vote.who, []);
  const filteredVoteActions = useSearchVotes(search, voteActions, getVoter);

  return (
    <>
      <div className="max-md:hidden">
        <DesktopTable
          voteActions={filteredVoteActions}
          loading={loading}
          listHeight={listHeight}
        />
      </div>
      <div className="hidden max-md:block">
        <MobileTable
          voteActions={filteredVoteActions}
          loading={loading}
          listHeight={listHeight}
        />
      </div>
    </>
  );
}
