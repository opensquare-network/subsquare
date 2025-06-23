import useQueryVoteActions from "../useQueryVoteActions";
import { useOnchainData } from "next-common/context/post";
import { desktopColumns, mobileColumns } from "./columns";
import { cn } from "next-common/utils";
import VirtualList from "next-common/components/dataList/virtualList";
import { useMemo } from "react";

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
      listHeight={400}
      overscanCount={3}
      noDataText="No data"
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
      )}
      columns={virtualColumns}
      rows={virtualRows}
      loading={loading}
      variableSize={true}
      getItemSize={getItemSize}
      listHeight={400}
      overscanCount={3}
      noDataText="No data"
    />
  );
}

// TODO: Mobile scroll & `getItemSize` after new style is ready
export default function VoteActionsTable() {
  const { referendumIndex } = useOnchainData();
  const { loading, voteActions } = useQueryVoteActions(referendumIndex);

  return (
    <>
      <div className="max-md:hidden">
        <DesktopTable voteActions={voteActions} loading={loading} />
      </div>
      <div className="hidden max-md:block">
        <MobileTable voteActions={voteActions} loading={loading} />
      </div>
    </>
  );
}
