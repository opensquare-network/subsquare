import { cn } from "next-common/utils";
import DataListItem from "./item";
import { createContext, forwardRef, useContext, useMemo } from "react";
import { isNil } from "lodash-es";
import TreeDataListBody from "./treeList/body";

export default forwardRef(DataListBody);

const DataListRowContext = createContext({});

function DataListRow({ row, index }) {
  const { rows, columnClassNames, columnStyles, columns, highlightedIndexes } =
    useContext(DataListRowContext);
  const rowIndex = isNil(index) ? (rows ?? []).indexOf(row) : index;

  return (
    <DataListItem
      row={row}
      columnClassNames={columnClassNames}
      columnStyles={columnStyles}
      columns={columns}
      highlighted={rowIndex >= 0 && !!highlightedIndexes?.includes(rowIndex)}
    />
  );
}

export const defaultRenderItem = (DataListItem, idx, rows) => (
  <DataListItem key={idx} index={idx} row={rows[idx]} />
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
  const rowContextValue = useMemo(
    () => ({
      rows,
      columnClassNames,
      columnStyles,
      columns,
      highlightedIndexes,
    }),
    [rows, columnClassNames, columnStyles, columns, highlightedIndexes],
  );

  return (
    <DataListRowContext.Provider value={rowContextValue}>
      <div
        ref={ref}
        className={cn(
          "datalist-body group/datalist-body",
          "scrollbar-pretty",
          "divide-y divide-neutral300 border-b border-neutral300",
          contentClassName,
        )}
      >
        {!tree && rows.map((_row, idx) => renderItem(DataListRow, idx, rows))}
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
    </DataListRowContext.Provider>
  );
}
