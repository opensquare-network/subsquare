import React, { memo } from "react";
import Accordion from "./accordion";
import Row from "./row";

function KVList({ data = [], title, showFold = true, KWidth }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <Accordion title={title} showFold={showFold}>
      {data.map((row, index) => (
        <Row headerWidth={KWidth} row={row} key={index} />
      ))}
    </Accordion>
  );
}

export default memo(KVList);
