import { SystemLoading } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import NoData from "../../noData";
import Checkbox from "next-common/components/checkbox";

export default function SelectableListBody({
  loading,
  rows,
  columns,
  noDataText,
  highlightedIndexes = [],
  selectedRows = [],
  toggleRowSelection,
}) {
  if (loading) {
    return (
      <SystemLoading className="w-5 h-5 mt-4 mb-2 mx-auto [&_path]:stroke-textDisabled" />
    );
  }

  if (!rows.length) {
    return <NoData showIcon={false} text={noDataText} />;
  }

  return (
    <div className="datalist-body">
      {rows.map((row, idx) => (
        <div
          key={idx}
          className={cn(
            "datalist-row",
            "flex items-center",
            "border-b border-neutral300",
            highlightedIndexes.includes(idx) && "bg-neutral200",
          )}
        >
          {row?.map((cell, cellIdx) => (
            <div
              role="listitem"
              key={cellIdx}
              className={cn(
                "datalist-item group/datalist-item",
                "w-full",
                "flex items-center py-4",
                "relative",
                columns[cellIdx]?.className,
                columns[cellIdx]?.style && {
                  style: columns[cellIdx].style,
                },
              )}
            >
              {cell}
            </div>
          ))}

          {/* row checkbox */}
          <Checkbox
            checked={selectedRows.includes(idx)}
            onClick={() => toggleRowSelection(idx)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}
