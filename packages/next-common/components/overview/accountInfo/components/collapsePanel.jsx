import { useState } from "react";
import { ArrowTriangleUp, ArrowTriangleDown } from "@osn/icons/subsquare";

export default function CollapsePanel({ children, labelItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const Icon = isCollapsed ? ArrowTriangleUp : ArrowTriangleDown;

  return (
    <>
      <div className="flex items-center justify-between">
        <div
          className="flex items-center justify-center border border-neutral400 rounded w-5 h-5 cursor-pointer"
          onClick={toggleCollapse}
        >
          <Icon className="w-3 h-3 [&_path]:fill-textSecondary" />
        </div>
        {labelItem}
      </div>
      {isCollapsed && <div className="space-y-4">{children}</div>}
    </>
  );
}
