import React, { memo } from "react";
import Row from "./row";

function KVList({ data = [] }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((row, index) =>
        Array.isArray(row) ? <Row row={row} key={index} /> : row,
      )}
    </>
  );
}

export default memo(KVList);
