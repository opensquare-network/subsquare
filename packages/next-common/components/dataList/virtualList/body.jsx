import { cn } from "next-common/utils";
import DataListItem from "../item";
import { FixedSizeList } from "react-window";
import { forwardRef } from "react";

export default forwardRef(VirtualListBody);

export const defaultRenderItem = (DataListItem, idx, rows) => (
  <DataListItem key={idx} row={rows[idx]} />
);

function VirtualListBody(
  {
    rows = [],
    renderItem = defaultRenderItem,
    columnClassNames = [],
    columnStyles = [],
    columns = [],
    highlightedIndexes = [],
    itemHeight = 50,
    listHeight = 400,
  },
  ref,
) {
  const renderRow = ({ index, style }) => {
    const row = rows[index];
    const isLastRow = index === rows.length - 1;

    return (
      <div
        style={style}
        key={row.key || index}
        className={cn(
          "flex items-center",
          !isLastRow && "border-b border-neutral300",
          highlightedIndexes.includes(index) ? "bg-highlight" : "",
        )}
      >
        {renderItem(
          ({ row }) => (
            <DataListItem
              row={row}
              columnClassNames={columnClassNames}
              columnStyles={columnStyles}
              columns={columns}
              highlighted={highlightedIndexes.includes(index)}
            />
          ),
          index,
          rows,
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "datalist-body group/datalist-body",
        "divide-y divide-neutral300 border-b border-neutral300",
      )}
    >
      <FixedSizeList
        ref={ref}
        height={listHeight}
        itemCount={rows.length}
        itemSize={itemHeight}
        className="scrollbar-pretty"
        width="100%"
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
}
