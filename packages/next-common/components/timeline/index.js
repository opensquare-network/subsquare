import React, { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";

export default function Timeline({ data = [], indent = true }) {
  let lastTimelineItem = data[data.length - 1];
  if (Array.isArray(lastTimelineItem)) {
    lastTimelineItem = lastTimelineItem[lastTimelineItem.length - 1];
  }
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem data={item} indent={indent} />
          ) : (
            <Item data={item} />
          )}
        </Fragment>
      ))}
    </>
  );
}
