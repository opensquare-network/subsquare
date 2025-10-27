import React, { useMemo } from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

export default function useColumns(
  columnsData,
  defaultSortedColumn,
  allowUnsort = false,
) {
  const [sortedColumn, setSortedColumn] = useState(defaultSortedColumn);

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
              onClick={() => {
                if (allowUnsort && sortedColumn === col.name) {
                  setSortedColumn(defaultSortedColumn || "");
                  return;
                }

                setSortedColumn(col.name);
              }}
            />
          ),
        };
      }),
    [columnsData, sortedColumn, allowUnsort, defaultSortedColumn],
  );

  return { sortedColumn, columns };
}
