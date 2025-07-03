import React from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

export default function useColumns(
  columnsData,
  defaultSortedColumn,
  allowUnsort = false,
) {
  const [sortedColumn, setSortedColumn] = useState(defaultSortedColumn);

  const columns = (columnsData || []).map((col) => {
    if (!col.sortable) {
      return col;
    }

    return {
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
      style: col.style,
      className: col.className,
    };
  });

  return { sortedColumn, columns };
}
