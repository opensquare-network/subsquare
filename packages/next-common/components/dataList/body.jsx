import { cn } from "next-common/utils";
import DataListItem from "./item";
import { forwardRef } from "react";
import TreeDataListBody from "./treeList/body";

export default forwardRef(DataListBody);

export const defaultRenderItem = (DataListItem, idx, rows) => (
  <DataListItem key={idx} row={rows[idx]} />
);

function DataListBody(
  {
    rows = [],
    renderItem = defaultRenderItem,
    columnClassNames = [],
    columnStyles = [],
    columns = [],
    highlightedIndexes = [],
    tree,
    treeKey,
    treeData = [],
    expandedRows,
    toggleRowExpansion,
    contentClassName = "",
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
        contentClassName,
      )}
    >
      {!tree &&
        rows.map((_row, idx) =>
          renderItem(
            ({ row }) => (
              <DataListItem
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
      {tree && (
        <TreeDataListBody
          rows={rows}
          treeKey={treeKey}
          treeData={treeData}
          expandedRows={expandedRows}
          toggleRowExpansion={toggleRowExpansion}
          columnClassNames={columnClassNames}
          columnStyles={columnStyles}
          columns={columns}
          highlightedIndexes={highlightedIndexes}
        />
      )}
    </div>
  );
}
