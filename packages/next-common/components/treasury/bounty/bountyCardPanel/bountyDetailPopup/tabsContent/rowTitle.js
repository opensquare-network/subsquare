import React from "react";
import { isNil } from "lodash-es";

function RowTitle({ index = 0, title = "-" }) {
  if (isNil(index) || isNil(title)) return null;

  return (
    <span key={index + "referenda"} className="text-textPrimary text14Medium">
      <span>{index}</span>
      <span className="text-textTertiary text14Medium px-1">·</span>
      <span> {title}</span>
    </span>
  );
}

export default React.memo(RowTitle);
