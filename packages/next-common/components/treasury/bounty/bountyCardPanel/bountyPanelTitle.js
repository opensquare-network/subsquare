import React from "react";
import { isNil } from "lodash-es";

function BountyPanelTitle({ activeCount }) {
  if (isNil(activeCount)) return null;

  return (
    <div className="px-5 leading-6 mb-4 ">
      <span className="text16Bold text-textPrimary">Active</span>&nbsp;
      <span className="text16Medium text-textTertiary">{activeCount} </span>
    </div>
  );
}

export default BountyPanelTitle;
