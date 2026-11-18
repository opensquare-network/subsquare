import { cn } from "next-common/utils";
import DataListItem from "./item";
import { createContext, forwardRef, useContext } from "react";
import TreeDataListBody from "./treeList/body";

export default forwardRef(DataListBody);

export const defaultRenderItem = (DataListItem, idx, rows) => (
  <DataListItem key={idx} row={rows[idx]} />
);

const DataListRowContext = createContext({});

// A stable component type for `renderItem`: creating it inline on every render
// would remount every row (and reset their local state, e.g. an open tooltip)
// whenever the list's parent re-renders.
function DataListRow({ row: rowProp }) {
  const context = useContext(DataListRowContext);
  // Renderers may pass a row they build themselves; fall back to the list row.
  const row = rowProp ?? context.row;

  return (
    <DataListItem
      row={row}
      columnClassNames={context.columnClassNames}
      columnStyles={context.columnStyles}
      columns={context.columns}
      highlighted={context.highlighted}
    />
  );
}

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
        rows.map((_row, idx) => (
          <DataListRowContext.Provider
            key={idx}
            value={{
              row: rows[idx],
              highlighted: highlightedIndexes.includes(idx),
              columnClassNames,
              columnStyles,
              columns,
            }}
          >
            {renderItem(DataListRow, idx, rows)}
          </DataListRowContext.Provider>
        ))}
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
