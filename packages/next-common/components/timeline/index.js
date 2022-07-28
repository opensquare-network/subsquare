import React, { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";
import TimelineAccordion from "./timelineAccordion";

export default function Timeline({
  data,
  chain,
  indent = true,
  type = "",
  motionEndInfo = null,
}) {
  if (!data || data?.length === 0) {
    return null;
  }

  let lastTimelineItem = data[data.length - 1];
  if (Array.isArray(lastTimelineItem)) {
    lastTimelineItem = lastTimelineItem[lastTimelineItem.length - 1];
  }

  return (
    <TimelineAccordion
      motionEndInfo={motionEndInfo}
      lastActivityTime={lastTimelineItem?.indexer?.blockTime}
    >
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem
              data={item}
              chain={chain}
              indent={indent}
              type={type}
            />
          ) : (
            <Item data={item} chain={chain} type={type} />
          )}
        </Fragment>
      ))}
    </TimelineAccordion>
  );
}
