import React from "react";

function TabLabel({ label, count = 0 }) {
  return (
    <span>
      <span className="text-theme500 text14Bold">{label}</span>{" "}
      <span className="text14Medium text-textTertiary">{count}</span>
    </span>
  );
}

export default React.memo(TabLabel);
