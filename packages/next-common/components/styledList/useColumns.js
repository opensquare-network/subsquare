import React from "react";
import { useState } from "react";
import SortableColumn from "./sortableColumn";

export default function useColumns(columnsData) {
  const [sortedColumn, setSortedColumn] = useState();

  const columns = (columnsData || []).map((col) => {
    if (!col.sortable) {
      return col;
    }

    return {
      name: (
        <SortableColumn name={col.name} sorted={sortedColumn === col.name} />
      ),
      style: col.style,
      onClick: () => setSortedColumn(col.name),
    };
  });

  return { sortedColumn, columns };
}
