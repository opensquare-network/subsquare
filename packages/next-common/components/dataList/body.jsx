import { cn } from "next-common/utils";
import DataListItem from "./item";
import { forwardRef } from "react";

export default forwardRef(DataListBody);

export const defaultRenderItem = (DataListItem, idx, rows) => (
  <DataListItem row={rows[idx]} />
);

function DataListBody(
  {
    rows = [],
    renderItem = defaultRenderItem,
    columnClassNames = [],
    columnStyles = [],
    columns = [],
    highlightedIndexes = [],
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "datalist-body group/datalist-body",
        "scrollbar-pretty",
        "divide-y divide-neutral300 border-b border-neutral300",
      )}
    >
      {rows.map((row, idx) =>
        renderItem(
          ({ row }) => (
            <DataListItem
              key={idx}
              row={row}
              columnClassNames={columnClassNames}
              columnStyles={columnStyles}
              columns={columns}
              highlighted={highlightedIndexes.includes(idx)}
            />
          ),
          idx,
          rows,
        ),
      )}
    </div>
  );
}
