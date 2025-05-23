import React from "react";

function BountyPanelTitle({ activeCount }) {
  return (
    <div className="px-5 leading-6 mb-4 ">
      <span className="text16Bold text-textPrimary">Active</span>&nbsp;
      <span className="text16Medium text-textTertiary">{activeCount} </span>
    </div>
  );
}

export default BountyPanelTitle;
