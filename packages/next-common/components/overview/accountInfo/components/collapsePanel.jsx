import React, { useState } from "react";
import { ArrowTriangleDown } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";
import useWindowSize from "next-common/utils/hooks/useWindowSize";
import SecondaryButton from "next-common/lib/button/secondary";
import { cn } from "next-common/utils";

export const AlwaysVisible = ({ children }) => children;

export default function CollapsePanel({
  defaultCollapsed = true,
  className,
  children,
  labelItem,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { width } = useWindowSize();

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  if (isNil(width)) {
    return null;
  }

  const alwaysVisibleContent = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === AlwaysVisible,
  );

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

      <div className={cn("flex flex-col ml-[12px]", className)}>
        {labelItem}
        {isCollapsed ? alwaysVisibleContent : children}
      </div>
    </div>
  ) : (
    <div className="flex flex-col">
      <div>{labelItem}</div>
      <div>{children}</div>
    </div>
  );
}
