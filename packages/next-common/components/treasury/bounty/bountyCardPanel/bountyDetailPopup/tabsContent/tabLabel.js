import React from "react";
import { isNil } from "lodash-es";

function TabLabel({ label, count = 0 }) {
  if (isNil(label) || isNil(count)) return null;

  return (
    <span>
      <span className="text-theme500 text14Bold">{label}</span>{" "}
      <span className="text14Medium text-textTertiary">{count}</span>
    </span>
  );
}

export default React.memo(TabLabel);
