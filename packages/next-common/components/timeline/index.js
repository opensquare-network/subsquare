import React, { Fragment } from "react";

import Item from "./item";
import FoldableItem from "./foldableItem";
import Accordion from "../listInfo/accordion";
import useDuration from "next-common/utils/hooks/useDuration";

export default function Timeline({
  data = [],
  indent = true,
  motionEndInfo = null,
}) {
  let lastTimelineItem = data[data.length - 1];
  if (Array.isArray(lastTimelineItem)) {
    lastTimelineItem = lastTimelineItem[lastTimelineItem.length - 1];
  }
  const duration = useDuration(lastTimelineItem?.indexer?.blockTime);
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <Accordion
      title={
        <span>
          Timeline
          <span className="ml-3 text-textTertiary text14Medium">
            {motionEndInfo || `Latest activity ${duration}`}
          </span>
        </span>
      }
    >
      {data.map((item, index) => (
        <Fragment key={index}>
          {Array.isArray(item) ? (
            <FoldableItem data={item} indent={indent} />
          ) : (
            <Item data={item} />
          )}
        </Fragment>
      ))}
    </Accordion>
  );
}
