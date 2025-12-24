import React, { useMemo } from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

function getSortDirections(sortable) {
  if (sortable === true || sortable === "desc") {
    return ["desc"];
  }
  if (sortable === "asc") {
    return ["asc"];
  }
  if (sortable === "asc,desc") {
    return ["asc", "desc"];
  }
  if (sortable === "desc,asc") {
    return ["desc", "asc"];
  }
  throw new Error(`Invalid sortable value: ${sortable}`);
}

export default function useColumns(
  columnsData,
  defaultSortedColumn,
  allowUnsort = false,
) {
  const defaultSortedColumnInfo = columnsData.find(
    (col) => defaultSortedColumn && col.name === defaultSortedColumn,
  );
  const defaultSortDirection = defaultSortedColumnInfo
    ? getSortDirections(defaultSortedColumnInfo.sortable)[0]
    : "desc";

  const [sortedColumn, setSortedColumn] = useState(defaultSortedColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  const columns = useMemo(
    () =>
      (columnsData || []).map((col) => {
        if (!col.sortable) {
          return col;
        }

        return {
          ...col,
          name: (
            <SortableColumn
              name={col.name}
              sorted={sortedColumn === col.name}
              sortDirection={sortDirection}
              sortDirectionIcon={col.sortDirectionIcon}
              onClick={() => {
                const sortDirections = getSortDirections(col.sortable);
                if (sortedColumn !== col.name) {
                  setSortedColumn(col.name);
                  setSortDirection(sortDirections[0]);
                  return;
                }

                if (sortDirections.length === 1) {
                  if (allowUnsort) {
                    if (defaultSortedColumn) {
                      setSortedColumn(defaultSortedColumn);
                      setSortDirection(defaultSortDirection);
                      return;
                    }

                    setSortedColumn("");
                    return;
                  }
                }

                if (sortDirection === sortDirections[0]) {
                  setSortDirection(sortDirections[1]);
                  return;
                }

                if (sortDirection === sortDirections[1]) {
                  if (!allowUnsort) {
                    setSortDirection(sortDirections[0]);
                    return;
                  }

                  if (!defaultSortedColumn) {
                    setSortedColumn("");
                    return;
                  }

                  setSortedColumn(defaultSortedColumn);
                  setSortDirection(defaultSortDirection);
                  return;
                }
              }}
            />
          ),
        };
      }),
    [
      columnsData,
      sortedColumn,
      defaultSortedColumn,
      defaultSortDirection,
      sortDirection,
      allowUnsort,
    ],
  );

  return { sortedColumn, sortDirection, columns };
}
