import React, { useMemo } from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

export default function useColumns(
  columnsData,
  defaultSortedColumn,
  allowUnsort = false,
  allowBidirectionalSort = false,
) {
  const [sortedColumn, setSortedColumn] = useState(defaultSortedColumn);
  const [sortDirection, setSortDirection] = useState("desc");

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
              onClick={() => {
                if (sortedColumn !== col.name) {
                  setSortedColumn(col.name);
                  setSortDirection("desc");
                  return;
                }

                if (!allowBidirectionalSort) {
                  if (allowUnsort) {
                    setSortedColumn(defaultSortedColumn || "");
                    setSortDirection("desc");
                  }
                  return;
                }

                if (sortDirection === "desc") {
                  setSortDirection("asc");
                  return;
                }

                if (sortDirection === "asc") {
                  if (!allowUnsort) {
                    setSortDirection("desc");
                    return;
                  }

                  if (!defaultSortedColumn) {
                    setSortedColumn("");
                    setSortDirection("desc");
                    return;
                  }

                  setSortedColumn(defaultSortedColumn);
                  setSortDirection("desc");
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
      sortDirection,
      allowUnsort,
      allowBidirectionalSort,
    ],
  );

  return { sortedColumn, sortDirection, columns };
}
