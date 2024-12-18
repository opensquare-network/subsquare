import { cn } from "next-common/utils";
import DataListItem from "./item";
import { forwardRef } from "react";
import { ArrowUp } from "@osn/icons/subsquare";

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
      {tree &&
        rows.map((row, idx) => {
          const isExpanded = expandedRows.has(idx);
          const children = tree ? treeData[idx][treeKey] : null;

          return (
            <div key={idx}>
              <div className="flex items-center space-x-6">
                {tree && children && (
                  <div className="flex-1 justify-center border border-neutral400 rounded-[4px] cursor-pointer p-[2px]">
                    <ArrowUp
                      role="button"
                      className={cn(
                        "[&_path]:stroke-textPrimary",
                        !isExpanded && "rotate-180",
                      )}
                      onClick={() => toggleRowExpansion(idx)}
                    />
                  </div>
                )}

                {renderItem(
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
                )}
              </div>

              {/* Render children if expanded */}
              {isExpanded && children.length > 0 && (
                <div className="pl-[54px] pb-4">
                  {children.map((child, childIdx) => (
                    <div
                      key={childIdx}
                      className="flex items-center space-x-1 py-1 text-textTertiary"
                    >
                      <span>↳ </span>
                      {columns.map((column, colIdx) => (
                        <div
                          key={colIdx}
                          className={cn(columnClassNames[colIdx], "flex-1")}
                          style={columnStyles[colIdx]}
                        >
                          {column.render
                            ? column.render(child)
                            : child[column.dataKey]}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
