import { useState } from "react";
import { ArrowTriangleDown } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";

export default function CollapsePanel({ children, labelItem }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowSize();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (isNil(width)) {
    return null;
  }

  return width > 768 ? (
    <div className="flex">
      <SecondaryButton
        size="small"
        className="w-5 h-5 mx-2.5 p-0"
        onClick={toggleCollapse}
      >
        <ArrowTriangleDown
          className={cn(
            "w-3 h-3 text-textSecondary",
            isCollapsed && "rotate-180",
          )}
        />
      </SecondaryButton>

      <div className="flex flex-col ml-[12px] w-[240px]">
        {labelItem}
        {isCollapsed && children}
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      <div>{labelItem}</div>
      <div>{children}</div>
    </div>
  );
}
