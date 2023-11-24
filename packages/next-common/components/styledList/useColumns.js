import React from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

export default function useColumns(columnsData, defaultSortedColumn) {
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
          onClick={() => setSortedColumn(col.name)}
        />
      ),
      style: col.style,
      className: col.className,
    };
  });

  return { sortedColumn, columns };
}
