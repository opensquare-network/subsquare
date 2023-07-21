import React, { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";

export default function Timeline({ data = [], indent = true, compact }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <div className="py-4">
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem data={item} indent={indent} compact={compact} />
          ) : (
            <Item data={item} compact={compact} />
          )}
        </Fragment>
      ))}
    </div>
  );
}
