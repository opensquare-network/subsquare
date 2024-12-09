import { useState } from "react";
import { ArrowTriangleUp, ArrowTriangleDown } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";

export default function CollapsePanel({ children, labelItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowSize();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const Icon = isCollapsed ? ArrowTriangleUp : ArrowTriangleDown;

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <div className="flex">
      <div
        className="flex items-center justify-center shrink-0 border border-neutral400 rounded w-5 h-5 mx-[10px] cursor-pointer"
        onClick={toggleCollapse}
      >
        <Icon className="w-3 h-3 [&_path]:fill-textSecondary" />
      </div>

      <div className="flex flex-col ml-[12px] w-[240px]">
        <div>{labelItem}</div>
        {isCollapsed && <div>{children}</div>}
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      <div>{labelItem}</div>
      <div>{children}</div>
    </div>
  );
}
