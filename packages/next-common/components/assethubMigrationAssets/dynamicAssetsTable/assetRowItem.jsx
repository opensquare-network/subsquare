import React from "react";
import DataListItem from "next-common/components/dataList/item";

export default function AssetRowItem({
  asset,
  columnsDef,
  classNames,
  styles,
}) {
  const row = columnsDef.map((col) => col.render(asset));

  return (
    <DataListItem
      columns={columnsDef}
      row={row}
      columnClassNames={classNames}
      columnStyles={styles}
    />
  );
}
