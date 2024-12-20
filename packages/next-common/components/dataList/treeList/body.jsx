import { cn } from "next-common/utils";
import DataListItem from "../item";
import { ArrowUp } from "@osn/icons/subsquare";

export default function TreeDataListBody({
  rows = [],
  columnClassNames = [],
  columnStyles = [],
  columns = [],
  highlightedIndexes = [],
  treeKey,
  treeData = [],
  expandedRows,
  toggleRowExpansion,
}) {
  return rows.map((_row, idx) => {
    const isExpanded = expandedRows.has(idx);
    const children = treeData[idx][treeKey] || null;

    return (
      <div key={idx}>
        <div className="flex items-center space-x-6">
          {children && (
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

          <DataListItem
            row={_row}
            columnClassNames={columnClassNames}
            columnStyles={columnStyles}
            columns={columns}
            highlighted={highlightedIndexes.includes(idx)}
            descriptionClassName={"hidden"}
          />
        </div>

        {/* Render children if expanded */}
        {isExpanded && children.length > 0 && (
          <div className="pl-[54px] pb-4">
            {children.map((child, childIdx) => {
              const row = columns.map((column, colIdx) => (
                <div
                  key={`${idx}-${colIdx}-${childIdx}`}
                  className={cn(
                    columnClassNames[colIdx],
                    "flex-1",
                    colIdx === 0 &&
                      "inline-flex space-x-1 py-1 text-textTertiary",
                  )}
                  style={columnStyles[colIdx]}
                >
                  {colIdx === 0 && <span>↳ </span>}
                  {column.render ? column.render(child) : child[column.dataKey]}
                </div>
              ));

              const childKey = `${idx}-${childIdx}`;
              return (
                <DataListItem
                  key={childKey}
                  row={row}
                  columnClassNames={columnClassNames}
                  columnStyles={columnStyles}
                  columns={columns}
                  itemClassName={"py-1"}
                  descriptionClassName={"pl-5 !mt-1"}
                  highlighted={highlightedIndexes.includes(childKey)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  });
}
